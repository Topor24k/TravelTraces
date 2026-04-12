import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface PhilippinesMapProps {
  onRegionClick?: (regionName: string) => void;
  className?: string;
  id?: string;
}

export const PhilippinesMap = ({ onRegionClick, className, id }: PhilippinesMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, side: 'right' as 'left' | 'right' });

  useEffect(() => {
    fetch('/Philippines.svg')
      .then(res => res.text())
      .then(svgText => {
        if (svgRef.current) {
          // Extract the paths from the SVG text
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, "image/svg+xml");
          const paths = doc.querySelectorAll("path");
          
          // Clear current content
          svgRef.current.innerHTML = "";
          
          paths.forEach((path, index) => {
            const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // Copy all attributes
            for (let i = 0; i < path.attributes.length; i++) {
              const attr = path.attributes[i];
              newPath.setAttribute(attr.name, attr.value);
            }
            
            // Add interactivity
            newPath.style.cursor = "pointer";
            newPath.style.transition = "fill 0.2s, transform 0.2s";
            newPath.setAttribute("vector-effect", "non-scaling-stroke");
            
            const originalFill = path.getAttribute("fill") || "#FFFBDD";
            
            newPath.addEventListener("mouseenter", () => {
              newPath.setAttribute("fill", "#fdf6b2");
              newPath.style.transform = "scale(1.005)";
              const regionName = path.getAttribute("name") || path.getAttribute("id") || path.getAttribute("title") || `Region ${index + 1}`;
              
              setHoveredRegion(regionName);
            });

            newPath.addEventListener("mousemove", (e) => {
              const side = e.clientX > window.innerWidth / 2 ? 'left' : 'right';
              
              setTooltipPos({ 
                x: side === 'right' ? e.clientX + 15 : e.clientX - 15,
                y: e.clientY,
                side
              });
            });
            
            newPath.addEventListener("mouseleave", () => {
              newPath.setAttribute("fill", originalFill);
              newPath.style.transform = "scale(1)";
              setHoveredRegion(null);
            });
            
            newPath.addEventListener("click", () => {
              if (onRegionClick) {
                const regionName = path.getAttribute("name") || path.getAttribute("id") || path.getAttribute("title") || `Region ${index + 1}`;
                onRegionClick(regionName);
              }
            });
            
            svgRef.current?.appendChild(newPath);
          });
        }
      });
  }, [onRegionClick]);

  return (
    <div id={id || "philippines-map-container"} className={cn("philippines-map-container", className)}>
      <svg 
        id="philippines-svg"
        ref={svgRef}
        width="1443" 
        height="2514" 
        viewBox="0 0 1443 2514" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="philippines-map-svg"
      />
      
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {hoveredRegion && (
            <motion.div
              id="map-tooltip-wrapper"
              initial={{ opacity: 0, x: tooltipPos.side === 'right' ? -10 : 10, y: '-50%' }}
              animate={{ opacity: 1, x: 0, y: '-50%' }}
              exit={{ opacity: 0, x: tooltipPos.side === 'right' ? -10 : 10, y: '-50%' }}
              className="map-tooltip-motion-div"
              style={{ 
                position: 'fixed', 
                left: tooltipPos.side === 'right' ? tooltipPos.x : 'auto',
                right: tooltipPos.side === 'left' ? window.innerWidth - tooltipPos.x : 'auto',
                top: Math.max(30, Math.min(window.innerHeight - 30, tooltipPos.y)),
                pointerEvents: 'none',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                flexDirection: tooltipPos.side === 'right' ? 'row' : 'row-reverse'
              }}
            >
              <div id="map-tooltip-content" className="map-tooltip-content">
                {hoveredRegion}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
