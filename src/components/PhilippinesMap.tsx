import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface PhilippinesMapProps {
  onRegionClick?: (regionName: string) => void;
  className?: string;
  id?: string;
  variant?: "default" | "explorer";
}

type RegionName = "Luzon" | "Visayas" | "Mindanao";

interface MapPlace {
  id: string;
  name: string;
  d: string;
  region: RegionName;
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

const DEFAULT_VIEWBOX = "0 0 1443 2514";

const REGION_COLORS: Record<RegionName, string> = {
  Luzon: "#f8d67d",
  Visayas: "#9ed3d0",
  Mindanao: "#f7b887",
};

const REGION_HOVER_COLORS: Record<RegionName, string> = {
  Luzon: "#f2c85f",
  Visayas: "#84c4bf",
  Mindanao: "#f1a66a",
};

const REGION_Y_THRESHOLDS = {
  luzonMax: 1300,
  visayasMax: 1800,
};

const getRegionByY = (y: number): RegionName => {
  if (y < REGION_Y_THRESHOLDS.luzonMax) return "Luzon";
  if (y < REGION_Y_THRESHOLDS.visayasMax) return "Visayas";
  return "Mindanao";
};

const expandBounds = (bounds: Bounds, padding = 35): Bounds => ({
  minX: Math.max(0, bounds.minX - padding),
  minY: Math.max(0, bounds.minY - padding),
  maxX: Math.min(1443, bounds.maxX + padding),
  maxY: Math.min(2514, bounds.maxY + padding),
});

const boundsToViewBox = (bounds: Bounds): string => {
  const width = Math.max(60, bounds.maxX - bounds.minX);
  const height = Math.max(60, bounds.maxY - bounds.minY);
  return `${bounds.minX} ${bounds.minY} ${width} ${height}`;
};

export const PhilippinesMap = ({ onRegionClick, className, id, variant = "default" }: PhilippinesMapProps) => {
  const isExplorer = variant === "explorer";
  const svgRef = useRef<SVGSVGElement>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
  const [activeRegion, setActiveRegion] = useState<RegionName | null>(null);
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

  const regionBounds = useMemo(() => {
    const initial: Record<RegionName, Bounds | null> = {
      Luzon: null,
      Visayas: null,
      Mindanao: null,
    };

    for (const place of places) {
      const current = initial[place.region];
      const nextBounds: Bounds = {
        minX: place.bbox.x,
        minY: place.bbox.y,
        maxX: place.bbox.x + place.bbox.width,
        maxY: place.bbox.y + place.bbox.height,
      };

      initial[place.region] = current
        ? {
            minX: Math.min(current.minX, nextBounds.minX),
            minY: Math.min(current.minY, nextBounds.minY),
            maxX: Math.max(current.maxX, nextBounds.maxX),
            maxY: Math.max(current.maxY, nextBounds.maxY),
          }
        : nextBounds;
    }

    return initial;
  }, [places]);

  useEffect(() => {
    fetch('/Philippines.svg')
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const pathElements = Array.from(doc.querySelectorAll("path"));

        const parsed = pathElements
          .map((path, index) => {
            const d = path.getAttribute("d");
            if (!d) return null;

            const name =
              path.getAttribute("name") ||
              path.getAttribute("id") ||
              path.getAttribute("title") ||
              `Place ${index + 1}`;

            return {
              id: `place-${index}`,
              name,
              d,
            };
          })
          .filter((item): item is { id: string; name: string; d: string } => item !== null);

        setPlaces(
          parsed.map((item) => ({
            ...item,
            region: "Luzon",
            bbox: new DOMRect(0, 0, 0, 0),
            cx: 0,
            cy: 0,
          })),
        );
      });
  }, []);

  useEffect(() => {
    if (!places.length) return;

    const next = places.map((place) => {
      const element = placeRefs.current.get(place.id);
      if (!element) return place;

      const bbox = element.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const region = getRegionByY(cy);

      return {
        ...place,
        bbox,
        cx,
        cy,
        region,
      };
    });

    const hasRealBbox = next.some((p) => p.bbox.width > 0 && p.bbox.height > 0);
    if (!hasRealBbox) return;

    setPlaces(next);
  }, [places.length]);

  useEffect(() => {
    if (!isExplorer) {
      setViewBox(DEFAULT_VIEWBOX);
      setActiveRegion(null);
      setSelectedPlaceId(null);
      setFocusedPlaceId(null);
      setPin(null);
      setIsFormOpen(false);
    }
  }, [isExplorer]);

  const zoomToRegion = (region: RegionName) => {
    const bounds = regionBounds[region];
    if (!bounds) return;

    setActiveRegion(region);
    setSelectedPlaceId(null);
    setPin(null);
    setViewBox(boundsToViewBox(expandBounds(bounds, 60)));
    onRegionClick?.(region);
  };

  const resetZoom = () => {
    setActiveRegion(null);
    setFocusedPlaceId(null);
    setSelectedPlaceId(null);
    setPin(null);
    setViewBox(DEFAULT_VIEWBOX);
  };

  const exitPlaceFocus = () => {
    if (!activeRegion) {
      resetZoom();
      return;
    }

    const bounds = regionBounds[activeRegion];
    if (!bounds) {
      resetZoom();
      return;
    }

    setFocusedPlaceId(null);
    setSelectedPlaceId(null);
    setPin(null);
    setViewBox(boundsToViewBox(expandBounds(bounds, 60)));
  };

  const handlePlaceClick = (place: MapPlace) => {
    if (!isExplorer) {
      onRegionClick?.(place.name);
      return;
    }

    if (!activeRegion) {
      zoomToRegion(place.region);
      return;
    }

    if (place.region !== activeRegion) {
      zoomToRegion(place.region);
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
        "philippines-map-container relative overflow-hidden",
        isExplorer && "rounded-[20px] border border-black/15 bg-[#f8f5e9]",
        className,
      )}
    >
      {isExplorer && (
        <>
          <div className="absolute top-4 left-4 z-20 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="font-limelight text-lg leading-none">Map Explorer</p>
            <p className="font-life-savers text-sm text-black/65 mt-1">
              1) Choose a major island group, 2) Click a place, 3) Pin and document it.
            </p>
            <p className="font-life-savers text-xs text-black/55 mt-2">
              Tip: When you pick a place, only that island remains visible for focused pinning.
            </p>
          </div>

          <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
            {(["Luzon", "Visayas", "Mindanao"] as RegionName[]).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => zoomToRegion(region)}
                className={cn(
                  "rounded-full border border-black/20 px-4 py-2 font-life-savers text-sm transition-colors",
                  activeRegion === region ? "bg-black text-white" : "bg-white/90 hover:bg-[#fff5cf]",
                )}
              >
                {region}
              </button>
            ))}
            <button
              type="button"
              onClick={resetZoom}
              className="rounded-full border border-black/20 bg-white/90 px-4 py-2 font-life-savers text-sm hover:bg-[#fff5cf]"
            >
              Reset
            </button>
            {focusedPlaceId && (
              <button
                type="button"
                onClick={exitPlaceFocus}
                className="rounded-full border border-black bg-black px-4 py-2 font-life-savers text-sm text-white"
              >
                Exit Place Focus
              </button>
            )}
          </div>
        </>
      )}

      <svg
        id="philippines-svg"
        ref={svgRef}
        width="1443"
        height="2514"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="philippines-map-svg w-full h-full transition-all duration-500"
      >
        {places.map((place) => {
          const isActiveRegion = !isExplorer || !activeRegion || place.region === activeRegion;
          const isFocused = !focusedPlaceId || focusedPlaceId === place.id;
          const isSelected = selectedPlaceId === place.id;
          const isHovered = hoveredPlaceId === place.id;
          const baseFill = isExplorer ? REGION_COLORS[place.region] : "#FFFBDD";

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
              fill={isHovered || isSelected ? (isExplorer ? REGION_HOVER_COLORS[place.region] : "#fdf6b2") : baseFill}
              stroke="#393939"
              strokeWidth={isExplorer && isSelected ? 3.4 : 2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                cursor: "pointer",
                opacity: isActiveRegion && isFocused ? 1 : 0,
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
