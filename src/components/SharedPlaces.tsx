import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";

export const SharedPlaces = () => {
  const [startIndex, setStartIndex] = useState(0);
  
  const allPlaces = [
    { name: "My Siargao Trip", location: "General Luna", image: "/images/Cloud%209%20Siargao.jpg", date: "Jan 12, 2026" },
    { name: "Bohol Adventure", location: "Carmen", image: "/images/Chocolate%20Hills.jpg", date: "Mar 05, 2026" },
    { name: "Palawan Getaway", location: "El Nido", image: "/images/El%20Nido%20Lagoons.jpg", date: "Apr 02, 2026" },
  ];

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % Math.max(1, allPlaces.length - 2));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + Math.max(1, allPlaces.length - 2)) % Math.max(1, allPlaces.length - 2));
  };

  const visiblePlaces = allPlaces.slice(startIndex, startIndex + 3);

  return (
    <section id="album" className="featured-places-section bg-[#F4F3EE]">
      <div id="shared-places-container" className="featured-places-container">
        <div id="shared-places-header" className="featured-places-header-group">
          <h2 id="shared-places-title" className="featured-places-title">My Shared Places</h2>
          <p id="shared-places-description" className="featured-places-description">
            Your personal travel album. Keep track of all the footprints you've left across the beautiful islands of the Philippines.
          </p>
        </div>

        <div id="shared-places-slider" className="featured-places-slider-wrapper">
          <button 
            id="shared-prev-btn"
            onClick={prevSlide}
            className="featured-nav-btn featured-prev-btn"
          >
            <ChevronLeft className="nav-icon w-8 h-8" />
          </button>
          
          <div id="shared-places-grid" className="featured-places-grid">
            {/* Add New Trace Card */}
            <motion.div 
              id="add-new-trace-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -15 }}
              className="featured-place-card group border-2 border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <h4 className="font-limelight text-xl text-black/80">Add New Place</h4>
              <p className="font-life-savers text-black/50 text-sm mt-2">Pin a new location</p>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {visiblePlaces.map((place) => (
                <motion.div 
                  id={`shared-place-${place.name.toLowerCase().replace(/\s+/g, '-')}`}
                  key={place.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -15 }}
                  className="featured-place-card group"
                >
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="featured-place-image"
                    referrerPolicy="no-referrer"
                  />
                  <div className="featured-place-overlay" />
                  <div className="featured-place-info">
                    <h4 className="featured-place-name">{place.name}</h4>
                    <p className="featured-place-location">{place.location} • {place.date}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button 
            id="shared-next-btn"
            onClick={nextSlide}
            className="featured-nav-btn featured-next-btn"
          >
            <ChevronRight className="nav-icon w-8 h-8" />
          </button>
        </div>

        <div id="shared-places-footer" className="featured-places-footer">
          <button id="view-album-btn" className="share-travel-button">
            Open Full Album
          </button>
        </div>
      </div>
    </section>
  );
};