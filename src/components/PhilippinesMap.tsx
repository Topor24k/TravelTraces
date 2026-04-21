import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { geoIdentity, geoMercator, geoPath } from "d3-geo";
import { cn } from "../lib/utils";

interface PhilippinesMapProps {
  onRegionClick?: (regionName: string) => void;
  className?: string;
  id?: string;
  variant?: "default" | "explorer";
  zoomLevel?: number;
  onZoomChange?: (zoomLevel: number) => void;
  onFitZoomChange?: (fitZoom: number) => void;
  showZoomControls?: boolean;
}

interface MapPlace {
  id: string;
  name: string;
  adm2Name: string;
  adm1Name: string;
  shapeLength: number;
  shapeArea: number;
  areaSqKm: number;
  d: string;
  bbox: DOMRect;
  cx: number;
  cy: number;
}

interface GeoFeatureProperties {
  ADM1_EN?: string;
  ADM2_EN?: string;
  ADM3_EN?: string;
  ADM1_PCODE?: string;
  ADM2_PCODE?: string;
  ADM3_PCODE?: string;
  Shape_Leng?: number;
  Shape_Area?: number;
  AREA_SQKM?: number;
  shape_length?: number;
  shape_area?: number;
  area_sqkm?: number;
}

interface GeoFeature {
  properties?: GeoFeatureProperties;
  geometry?: unknown;
}

interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

// Larger canvas while keeping full-country visibility.
const SVG_SCALE = 2;
const SVG_WIDTH = 2666 * SVG_SCALE;
const SVG_HEIGHT = 4666 * SVG_SCALE;
const DEFAULT_VIEWBOX = `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`;
const MAP_CONTENT_SCALE = 0.94;
const EXPLORER_BASE_WIDTH_PX = 1200;
const DEFAULT_VISUAL_ZOOM_MULTIPLIER = 5;
const MIN_EXPLORER_ZOOM = 0.2;
const MAX_EXPLORER_ZOOM = 3;

const MAP_FILL = "#FFFBDD";
const MAP_HOVER_FILL = "#fdf6b2";

const PH_GEOJSON_URL = "/data/Philippines.geojson";

const getFeatureMetric = (properties: GeoFeatureProperties) => ({
  shapeLength: properties.Shape_Leng ?? properties.shape_length ?? 0,
  shapeArea: properties.Shape_Area ?? properties.shape_area ?? 0,
  areaSqKm: properties.AREA_SQKM ?? properties.area_sqkm ?? 0,
});

const buildProjectedPaths = (
  featureCollection: GeoFeatureCollection,
  projectionFactory: () => any,
) => {
  const projection = projectionFactory();
  const pathGenerator = geoPath(projection);

  return featureCollection.features
    .map((feature: GeoFeature, index: number) => {
      if (!feature.geometry) return null;

      const d = pathGenerator(feature as any);
      if (!d) return null;

      const properties = feature.properties ?? {};
      const adm1Name = properties.ADM1_EN ?? "Unknown Region";
      const adm2Name = properties.ADM2_EN ?? "Unknown Place Group";
      const name = properties.ADM3_EN ?? properties.ADM3_PCODE ?? `Place ${index + 1}`;
      const metrics = getFeatureMetric(properties);
      const fallbackMetricToken = `${metrics.shapeLength.toFixed(3)}-${metrics.shapeArea.toFixed(3)}-${metrics.areaSqKm.toFixed(3)}`;

      return {
        id: properties.ADM3_PCODE ?? `${properties.ADM2_PCODE ?? "adm2"}-${index}-${fallbackMetricToken}`,
        name: String(name),
        adm2Name: String(adm2Name),
        adm1Name: String(adm1Name),
        shapeLength: metrics.shapeLength,
        shapeArea: metrics.shapeArea,
        areaSqKm: metrics.areaSqKm,
        d,
      };
    })
    .filter(
      (
        item:
          | {
              id: string;
              name: string;
              adm2Name: string;
              adm1Name: string;
              shapeLength: number;
              shapeArea: number;
              areaSqKm: number;
              d: string;
            }
          | null,
      ): item is {
        id: string;
        name: string;
        adm2Name: string;
        adm1Name: string;
        shapeLength: number;
        shapeArea: number;
        areaSqKm: number;
        d: string;
      } => item !== null,
    );
};

const buildPlacesFromFeatureCollection = (featureCollection: GeoFeatureCollection) => {
  // Try geographic projection first; if the source is already projected, fallback to planar fit.
  const mercatorPaths = buildProjectedPaths(
    featureCollection,
    () => geoMercator().fitSize([SVG_WIDTH * MAP_CONTENT_SCALE, SVG_HEIGHT * MAP_CONTENT_SCALE], featureCollection as any),
  );

  if (mercatorPaths.length) return mercatorPaths;

  return buildProjectedPaths(
    featureCollection,
    () => geoIdentity().reflectY(true).fitSize([SVG_WIDTH * MAP_CONTENT_SCALE, SVG_HEIGHT * MAP_CONTENT_SCALE], featureCollection as any),
  );
};

export const PhilippinesMap = ({
  onRegionClick,
  className,
  id,
  variant = "default",
  zoomLevel,
  onZoomChange,
  onFitZoomChange,
  showZoomControls = true,
}: PhilippinesMapProps) => {
  const isExplorer = variant === "explorer";
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [fitZoom, setFitZoom] = useState(1);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [pin, setPin] = useState<{ x: number; y: number; placeName: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [journalForm, setJournalForm] = useState({
    placeName: "",
    category: "Nature",
    message: "",
    image: null as File | null,
  });

  const placeRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const groupedPlaceSummary = useMemo(() => {
    const byRegion = new Map<string, Set<string>>();

    places.forEach((place) => {
      const existing = byRegion.get(place.adm1Name) ?? new Set<string>();
      existing.add(place.adm2Name);
      byRegion.set(place.adm1Name, existing);
    });

    const regionCount = byRegion.size;
    const placeGroupCount = Array.from(byRegion.values()).reduce((count, groups) => count + groups.size, 0);
    const municipalityCount = places.length;

    return { regionCount, placeGroupCount, municipalityCount };
  }, [places]);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        setIsLoadingMap(true);
        setMapLoadError(null);
        const response = await fetch(PH_GEOJSON_URL);
        if (!response.ok) {
          throw new Error("Failed to load Philippines GeoJSON map.");
        }

        const featureCollection = (await response.json()) as GeoFeatureCollection;
        const parsedPlaces = buildPlacesFromFeatureCollection(featureCollection);

        if (!parsedPlaces.length) {
          throw new Error("No drawable features were found in Philippines.geojson.");
        }

        if (!isMounted || !parsedPlaces.length) return;

        setPlaces(
          parsedPlaces.map((item) => ({
            ...item,
            bbox: new DOMRect(0, 0, 0, 0),
            cx: 0,
            cy: 0,
          })),
        );
        // Always start with the full Philippines extent so no area is cut off.
        setViewBox(DEFAULT_VIEWBOX);
      } catch (error) {
        setPlaces([]);
        setMapLoadError(error instanceof Error ? error.message : "Unable to render the GeoJSON map.");
        console.error("Unable to render Phl_admbnda map:", error);
      } finally {
        setIsLoadingMap(false);
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!places.length) return;

    const next = places.map((place) => {
      const element = placeRefs.current.get(place.id);
      if (!element) return place;

      const bbox = element.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      return {
        ...place,
        bbox,
        cx,
        cy,
      };
    });

    const hasRealBbox = next.some((p) => p.bbox.width > 0 && p.bbox.height > 0);
    if (!hasRealBbox) return;

    setPlaces(next);

  }, [places.length, isExplorer]);

  useEffect(() => {
    if (!isExplorer) {
      setViewBox(DEFAULT_VIEWBOX);
      setSelectedPlaceId(null);
      setFitZoom(1);
      setPin(null);
      setIsFormOpen(false);
    }
  }, [isExplorer]);

  const clampZoom = (value: number) => Math.min(MAX_EXPLORER_ZOOM, Math.max(MIN_EXPLORER_ZOOM, value));

  const setTooltipFromPointer = (event: React.MouseEvent<SVGPathElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left + 14,
      y: event.clientY - rect.top + 14,
    });
  };

  useEffect(() => {
    if (!isExplorer) return;

    const container = containerRef.current;
    if (!container) return;

    const svgAspectRatio = SVG_HEIGHT / SVG_WIDTH;
    const baseHeight = EXPLORER_BASE_WIDTH_PX * svgAspectRatio;

    const updateFitZoom = () => {
      const widthFit = container.clientWidth / EXPLORER_BASE_WIDTH_PX;
      const heightFit = container.clientHeight / baseHeight;
      const nextFit = clampZoom(Math.min(widthFit, heightFit));

      setFitZoom(nextFit);
      onFitZoomChange?.(nextFit);
    };

    updateFitZoom();

    const observer = new ResizeObserver(updateFitZoom);
    observer.observe(container);

    return () => observer.disconnect();
  }, [isExplorer, onFitZoomChange]);

  const handlePlaceClick = (place: MapPlace) => {
    if (!isExplorer) {
      onRegionClick?.(`${place.adm1Name} • ${place.adm2Name}`);
      return;
    }

    setSelectedPlaceId(place.id);
    setPin({ x: place.cx, y: place.cy, placeName: place.name });
    setJournalForm((prev) => ({ ...prev, placeName: place.name }));
    setIsFormOpen(true);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setJournalForm((prev) => ({ ...prev, image: file }));
  };

  const submitJournal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFormOpen(false);
  };

  return (
    <div
      id={id || "philippines-map-container"}
      ref={containerRef}
      className={cn(
        "philippines-map-container relative",
        isExplorer && "w-full h-full",
        className,
      )}
    >
      {isLoadingMap && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#F4F3EE]/70 backdrop-blur-[1px]">
          <p className="rounded-full border border-black/10 bg-white/80 px-4 py-2 font-life-savers text-sm text-black/70">
            Loading Philippines map...
          </p>
        </div>
      )}

      {mapLoadError && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#F4F3EE]/80 p-4">
          <p className="max-w-[560px] rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-center font-life-savers text-sm text-red-700">
            {mapLoadError}
          </p>
        </div>
      )}

      {isExplorer && showZoomControls && (
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-black/15 bg-white/85 p-1 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={() => onZoomChange?.(Math.max(MIN_EXPLORER_ZOOM, (zoomLevel ?? 1) - 0.15))}
            className="h-8 w-8 rounded-full border border-black/10 bg-white font-life-savers text-lg leading-none"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => onZoomChange?.(1)}
            className="rounded-full border border-black/10 bg-white px-2 py-1 font-life-savers text-xs"
            aria-label="Reset zoom"
          >
            {Math.round((zoomLevel ?? 1) * 100)}%
          </button>
          <button
            type="button"
            onClick={() => onZoomChange?.(Math.min(MAX_EXPLORER_ZOOM, (zoomLevel ?? 1) + 0.15))}
            className="h-8 w-8 rounded-full border border-black/10 bg-white font-life-savers text-lg leading-none"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      )}

      <svg
        id="philippines-svg"
        ref={svgRef}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={viewBox}
        preserveAspectRatio={isExplorer ? "xMidYMid meet" : "xMidYMid meet"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "philippines-map-svg transition-all duration-500 block mx-auto",
          isExplorer ? "h-auto max-w-none" : "w-auto h-auto",
        )}
        style={
          isExplorer
            ? { width: `${Math.round(EXPLORER_BASE_WIDTH_PX * fitZoom * (zoomLevel ?? 1) * DEFAULT_VISUAL_ZOOM_MULTIPLIER)}px` }
            : undefined
        }
      >
        <g>
          {places.map((place) => {
            const isSelected = selectedPlaceId === place.id;
            const isHovered = hoveredPlaceId === place.id;
            const baseFill = MAP_FILL;

            return (
              <path
                key={place.id}
                ref={(node) => {
                  if (node) {
                    placeRefs.current.set(place.id, node);
                  } else {
                    placeRefs.current.delete(place.id);
                  }
                }}
                d={place.d}
                fill={isHovered || isSelected ? MAP_HOVER_FILL : baseFill}
                stroke="#393939"
                strokeWidth={isExplorer && isSelected ? 3.4 : 2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  cursor: "pointer",
                  transition: "fill 220ms ease",
                }}
                onMouseEnter={(event) => {
                  setHoveredPlaceId(place.id);
                  setTooltipFromPointer(event);
                }}
                onMouseMove={setTooltipFromPointer}
                onMouseLeave={() => {
                  setHoveredPlaceId(null);
                  setTooltipPosition(null);
                }}
                onClick={() => handlePlaceClick(place)}
              />
            );
          })}

          <AnimatePresence>
            {pin && (
              <motion.g
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <circle cx={pin.x} cy={pin.y} r={16} fill="rgba(255, 87, 87, 0.2)" />
                <circle cx={pin.x} cy={pin.y} r={7} fill="#ff5757" stroke="#fff" strokeWidth={2} />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </svg>

      <AnimatePresence>
        {hoveredPlaceId && tooltipPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="pointer-events-none absolute z-20 rounded-full border border-black/10 bg-[#222] px-4 py-2 font-life-savers text-sm text-white shadow-xl"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            {(() => {
              const hovered = places.find((p) => p.id === hoveredPlaceId);
              if (!hovered) return null;
              return (
                <div className="leading-tight">
                  <div>{hovered.name}</div>
                  <div className="text-[11px] text-white/75">Municipality: {hovered.name} • Province: {hovered.adm2Name} • Region: {hovered.adm1Name}</div>
                  <div className="text-[10px] text-white/65">
                    SQKM: {hovered.areaSqKm.toFixed(2)} | Area: {hovered.shapeArea.toFixed(2)} | Length: {hovered.shapeLength.toFixed(2)}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExplorer && isFormOpen && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onSubmit={submitJournal}
              className="w-full max-w-[560px] rounded-[22px] border border-black/15 bg-[#F4F3EE] p-5 md:p-7 shadow-2xl"
            >
              <h3 className="font-limelight text-3xl">Add Documentation</h3>
              <p className="font-life-savers text-sm text-black/60 mt-1 mb-5">
                Your pin is set on {journalForm.placeName || "selected place"}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-life-savers text-sm">Name of the Place</span>
                  <input
                    required
                    value={journalForm.placeName}
                    onChange={(e) => setJournalForm((prev) => ({ ...prev, placeName: e.target.value }))}
                    className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-life-savers"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-life-savers text-sm">Category</span>
                  <select
                    value={journalForm.category}
                    onChange={(e) => setJournalForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-life-savers"
                  >
                    <option>Nature</option>
                    <option>City Life</option>
                    <option>Food</option>
                    <option>Culture</option>
                    <option>Adventure</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-1.5">
                <span className="font-life-savers text-sm">Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-life-savers"
                />
                <span className="font-life-savers text-xs text-black/55">
                  {journalForm.image ? `${journalForm.image.name} selected` : "No image selected"}
                </span>
              </label>

              <label className="mt-4 flex flex-col gap-1.5">
                <span className="font-life-savers text-sm">Message</span>
                <textarea
                  required
                  rows={4}
                  value={journalForm.message}
                  onChange={(e) => setJournalForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-life-savers resize-none"
                  placeholder="Write your journal or travel documentation..."
                />
              </label>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full border border-black/20 px-4 py-2 font-life-savers text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-black px-5 py-2 font-life-savers text-sm text-white"
                >
                  Save Documentation
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
