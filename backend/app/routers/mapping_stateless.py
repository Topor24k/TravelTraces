from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.core.mapping import Coordinate, GeocodingService, GraphRoutingService, Location, RouteEngine, RouteMode, RoutingService
from app.core.meetup_planner import MeetupPlannerParticipant, MeetupPlannerService
from app.core.validation import clean_plain_text
from app.models.mapping import (
    LocationInput,
    LocationResponse,
    MeetupRequest,
    MeetupResponse,
    MeetupSuggestionResponse,
    RouteRequest,
    RouteResponse,
    SearchResponse,
)


router = APIRouter(prefix="/api", tags=["mapping"])

geocoder = GeocodingService(
    nominatim_url=settings.nominatim_url,
    photon_url=settings.photon_url,
    region_hint=settings.region_hint,
)
routing_service = RoutingService(osrm_url=settings.osrm_url)
graph_routing_service = GraphRoutingService()
meetup_service = MeetupPlannerService(geocoder=geocoder, routing=routing_service)


def _location_response(location: Location) -> LocationResponse:
    try:
        label = clean_plain_text(location.label, max_length=240, field_name="label") or "Unknown location"
    except ValueError:
        label = "Unknown location"
    return LocationResponse(
        coordinate=location.coordinate.as_leaflet(),
        label=label,
        provider=location.provider,
        confidence=location.confidence,
    )


async def _resolve_location(payload: LocationInput) -> Location:
    if payload.lat is not None and payload.lon is not None:
        try:
            coordinate = Coordinate(payload.lat, payload.lon)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        label = payload.label or await geocoder.reverse_label(coordinate)
        return Location(coordinate=coordinate, label=label, provider="manual", confidence=1.0)
    if not payload.query:
        raise HTTPException(status_code=422, detail="Location query is required.")
    try:
        return await geocoder.resolve(payload.query)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/health")
async def api_health() -> dict[str, str]:
    return {"status": "ok", "service": "mapping"}


@router.get("/search", response_model=SearchResponse)
async def search_locations(
    query: str = Query(..., min_length=1, max_length=160),
    limit: int = Query(default=8, ge=1, le=20),
) -> SearchResponse:
    query = clean_plain_text(query, max_length=160, field_name="query") or query
    results = await geocoder.search(query=query, limit=limit)
    return SearchResponse(query=query, results=[_location_response(item) for item in results])


@router.get("/autocomplete", response_model=SearchResponse)
@router.get("/mapping/autocomplete", response_model=SearchResponse)
async def autocomplete_locations(
    query: str | None = Query(default=None, min_length=1, max_length=160),
    q: str | None = Query(default=None, min_length=1, max_length=160),
    limit: int = Query(default=8, ge=1, le=12),
) -> SearchResponse:
    query = query or q
    if not query:
        raise HTTPException(status_code=422, detail="Search query is required.")
    query = clean_plain_text(query, max_length=160, field_name="query") or query
    results = await geocoder.autocomplete(query=query, limit=limit)
    return SearchResponse(query=query, results=[_location_response(item) for item in results])


@router.get("/reverse", response_model=LocationResponse)
@router.get("/mapping/reverse-geocode", response_model=LocationResponse)
async def reverse_geocode(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
) -> LocationResponse:
    try:
        coordinate = Coordinate(lat, lon)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return _location_response(await geocoder.reverse(coordinate))


@router.post("/route", response_model=RouteResponse)
@router.post("/routes", response_model=RouteResponse)
@router.post("/routes/driving", response_model=RouteResponse)
async def driving_route(request: RouteRequest) -> RouteResponse:
    origin = await _resolve_location(request.origin)
    destination = await _resolve_location(request.destination)
    waypoints = [await _resolve_location(item) for item in request.waypoints]
    session_id = request.session_id or str(uuid.uuid4())
    route_mode = RouteMode(request.mode)
    route_engine = RouteEngine(request.engine)
    if route_engine == RouteEngine.OSRM:
        route = await routing_service.build_route(
            session_id=session_id,
            origin=origin,
            destination=destination,
            waypoints=waypoints,
            mode=route_mode,
        )
    else:
        route = graph_routing_service.build_route(
            session_id=session_id,
            origin=origin,
            destination=destination,
            waypoints=waypoints,
            mode=route_mode,
            engine=route_engine,
            custom_graph=request.custom_graph,
        )
    return RouteResponse(
        **route.to_public_dict(),
        record_id=None,
        scope=None,
        creator_id=None,
        group_ids=[],
    )


@router.post("/meetup/suggest", response_model=MeetupResponse)
async def suggest_meetup(request: MeetupRequest) -> MeetupResponse:
    participants: list[MeetupPlannerParticipant] = []
    for item in request.participants:
        location = await _resolve_location(LocationInput(query=item.query, lat=item.lat, lon=item.lon, label=item.label))
        participant_id = item.participant_id or f"{item.source}-{len(participants) + 1}"
        display_name = item.display_name or item.label or location.label.split(",")[0] or f"Participant {len(participants) + 1}"
        participants.append(
            MeetupPlannerParticipant(
                participant_id=participant_id,
                display_name=display_name,
                profile_photo=item.profile_photo,
                source=item.source,
                location=location,
            )
        )
    try:
        result = await meetup_service.suggest(
            participants,
            limit=request.limit,
            exclude_names=request.exclude_names,
            randomize=request.randomize,
            travel_time_minutes=request.travel_time_minutes,
            alpha=request.alpha,
            beta=request.beta,
            gamma=request.gamma,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return MeetupResponse(
        request_id=result.request_id,
        midpoint=result.midpoint,
        fair_region=result.fair_region,
        suggestions=[MeetupSuggestionResponse(**item.__dict__) for item in result.suggestions],
        participant_count=result.participant_count,
        participants=result.participants,
        algorithm=result.algorithm,
        fallback_strategy=result.fallback_strategy,
        scoring_weights=result.scoring_weights,
        metadata=result.metadata,
    )
