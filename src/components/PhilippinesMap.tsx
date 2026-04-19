import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { geoMercator, geoPath } from "d3-geo";
import { feature as topojsonFeature } from "topojson-client";
import { cn } from "../lib/utils";

interface PhilippinesMapProps {
  onRegionClick?: (regionName: string) => void;
  className?: string;
  id?: string;
  variant?: "default" | "explorer";
}

interface MapPlace {
  id: string;
  name: string;
  d: string;
  bbox: DOMRect;
  cx: number;
  cy: number;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Larger canvas (2x from previous) while keeping full-country visibility
const SVG_SCALE = 2;
const SVG_WIDTH = 2666 * SVG_SCALE;
const SVG_HEIGHT = 4666 * SVG_SCALE;
const DEFAULT_VIEWBOX = `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`;
const EXPLORER_ZOOM = 9;
const EXPLORER_RENDER_WIDTH_PX = 2200;

const MAP_FILL = "#FFFBDD";
const MAP_HOVER_FILL = "#fdf6b2";

const expandBounds = (bounds: Bounds, padding = 150): Bounds => ({
  minX: Math.max(0, bounds.minX - padding),
  minY: Math.max(0, bounds.minY - padding),
  maxX: Math.min(SVG_WIDTH, bounds.maxX + padding),
  maxY: Math.min(SVG_HEIGHT, bounds.maxY + padding),
});

const getMapBounds = (places: MapPlace[]): Bounds | null => {
  const realBounds = places
    .map((place) => place.bbox)
    .filter((bbox) => bbox.width > 0 && bbox.height > 0);

  if (!realBounds.length) return null;

  return realBounds.reduce<Bounds>(
    (accumulator, bbox) => ({
      minX: Math.min(accumulator.minX, bbox.x),
      minY: Math.min(accumulator.minY, bbox.y),
      maxX: Math.max(accumulator.maxX, bbox.x + bbox.width),
      maxY: Math.max(accumulator.maxY, bbox.y + bbox.height),
    }),
    {
      minX: realBounds[0].x,
      minY: realBounds[0].y,
      maxX: realBounds[0].x + realBounds[0].width,
      maxY: realBounds[0].y + realBounds[0].height,
    },
  );
};

const boundsToViewBox = (bounds: Bounds): string => {
  const width = Math.max(60, bounds.maxX - bounds.minX);
  const height = Math.max(60, bounds.maxY - bounds.minY);
  return `${bounds.minX} ${bounds.minY} ${width} ${height}`;
};

const getExplorerViewBox = (bounds: Bounds): string => {
  const fullWidth = Math.max(60, bounds.maxX - bounds.minX);
  const fullHeight = Math.max(60, bounds.maxY - bounds.minY);
  const width = Math.max(60, fullWidth / EXPLORER_ZOOM);
  const height = Math.max(60, fullHeight / EXPLORER_ZOOM);
  const centerX = bounds.minX + fullWidth / 2;
  const centerY = bounds.minY + fullHeight / 2;

  const minX = bounds.minX;
  const maxX = Math.max(bounds.minX, bounds.maxX - width);
  const minY = bounds.minY;
  const maxY = Math.max(bounds.minY, bounds.maxY - height);

  const x = Math.min(maxX, Math.max(minX, centerX - width / 2));
  const y = Math.min(maxY, Math.max(minY, centerY - height / 2));

  return `${x} ${y} ${width} ${height}`;
};

const PH_ADM3_TOPO_URL = "/data/phl-adm3.topo.json";

const buildPlacesFromFeatureCollection = (featureCollection: any) => {
  // Fit to 3x larger size so map details are much more visible and requires scrolling
  const projection = geoMercator().fitSize([SVG_WIDTH, SVG_HEIGHT], featureCollection);
  const pathGenerator = geoPath(projection);

  return featureCollection.features
    .map((feature: any, index: number) => {
      const d = pathGenerator(feature);
      if (!d) return null;

      const properties = feature.properties ?? {};
      const name =
        properties.ADM3_EN ??
        properties.ADM2_EN ??
        properties.ADM1_EN ??
        properties.ADM3_PCODE ??
        `Place ${index + 1}`;

      return {
        id: `place-${index}`,
        name: String(name),
        d,
      };
    })
    .filter((item: { id: string; name: string; d: string } | null): item is { id: string; name: string; d: string } => item !== null);
};

export const PhilippinesMap = ({ onRegionClick, className, id, variant = "default" }: PhilippinesMapProps) => {
  const isExplorer = variant === "explorer";
  const svgRef = useRef<SVGSVGElement>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
  const [focusedPlaceId, setFocusedPlaceId] = useState<string | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [pin, setPin] = useState<{ x: number; y: number; placeName: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [journalForm, setJournalForm] = useState({
    placeName: "",
    category: "Nature",
    message: "",
    image: null as File | null,
  });

  const placeRefs = useRef<Map<string, SVGPathElement>>(new Map());

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        const response = await fetch(PH_ADM3_TOPO_URL);
        if (!response.ok) {
          throw new Error("Failed to load prebuilt TopoJSON map.");
        }

        const topo = await response.json();
        const featureCollection = topojsonFeature(topo, topo.objects.adm3);
        const parsedPlaces = buildPlacesFromFeatureCollection(featureCollection);

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
        console.error("Unable to render Phl_admbnda map:", error);
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

    if (isExplorer) {
      const mapBounds = getMapBounds(next);
      if (mapBounds) {
        setViewBox(getExplorerViewBox(mapBounds));
      }
    }
  }, [places.length, isExplorer]);

  useEffect(() => {
    if (!isExplorer) {
      setViewBox(DEFAULT_VIEWBOX);
      setSelectedPlaceId(null);
      setFocusedPlaceId(null);
      setPin(null);
      setIsFormOpen(false);
    }
  }, [isExplorer]);

  const handlePlaceClick = (place: MapPlace) => {
    if (!isExplorer) {
      onRegionClick?.(place.name);
      return;
    }

    const placeBounds: Bounds = {
      minX: place.bbox.x,
      minY: place.bbox.y,
      maxX: place.bbox.x + place.bbox.width,
      maxY: place.bbox.y + place.bbox.height,
    };

    setSelectedPlaceId(place.id);
    setFocusedPlaceId(place.id);
    setPin({ x: place.cx, y: place.cy, placeName: place.name });
    setViewBox(boundsToViewBox(expandBounds(placeBounds, 90)));
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
      className={cn(
        "philippines-map-container relative",
        isExplorer && "w-full",
        className,
      )}
    >
      <svg
        id="philippines-svg"
        ref={svgRef}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={viewBox}
        preserveAspectRatio={isExplorer ? "xMidYMid meet" : "xMidYMid meet"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={isExplorer ? { width: `${EXPLORER_RENDER_WIDTH_PX}px` } : undefined}
        className={cn(
          "philippines-map-svg transition-all duration-500 block mx-auto",
          isExplorer ? "max-w-none h-auto" : "w-auto h-auto",
        )}
      >
        <g>
          {places.map((place) => {
            const isFocused = !focusedPlaceId || focusedPlaceId === place.id;
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
                  opacity: isFocused ? 1 : 0,
                  transition: "fill 220ms ease, opacity 260ms ease",
                }}
                onMouseEnter={() => setHoveredPlaceId(place.id)}
                onMouseLeave={() => setHoveredPlaceId(null)}
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
        {hoveredPlaceId && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-black/10 bg-[#222] px-4 py-2 font-life-savers text-sm text-white shadow-xl"
          >
            {places.find((p) => p.id === hoveredPlaceId)?.name}
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
