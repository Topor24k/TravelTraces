import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const UserFeaturedPlaces = () => {
  const [startIndex, setStartIndex] = useState(0);
  
  const allPlaces = [
    { name: "Aliwagwag Falls", location: "Davao Oriental", image: "/images/Aliwagwag%20Falls.jpg" },
    { name: "El Nido Lagoon", location: "Palawan", image: "/images/El%20Nido%20Lagoons.jpg" },
    { name: "Enchanted River", location: "Surigao del Sur", image: "/images/Enchanted%20River.jpg" },
    { name: "Boracay", location: "Malay, Aklan", image: "/images/Boracay.jpg" },
    { name: "Chocolate Hills", location: "Bohol", image: "/images/Chocolate%20Hills.jpg" },
    { name: "Mayon Volcano", location: "Albay", image: "/images/Mayon%20Volcano.jpg" },
    { name: "Cloud 9", location: "Siargao", image: "/images/Cloud%209%20Siargao.jpg" },
    { name: "Banaue Rice Terraces", location: "Ifugao", image: "/images/Banana%20Rice%20Terraces.jpg" },
  ];

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % (allPlaces.length - 3));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + (allPlaces.length - 3)) % (allPlaces.length - 3));
  };

  const visiblePlaces = allPlaces.slice(startIndex, startIndex + 4);

  return (
    <section id="user-explore" className="user-featured-places-section">
      <div id="user-featured-places-container" className="featured-places-container">
        <div id="user-featured-places-header" className="featured-places-header-group">
          <h2 id="user-featured-places-title" className="featured-places-title">Featured Top Places</h2>
          <p id="user-featured-places-description" className="featured-places-description">
            Not sure where to start? Browse through categories and see what other travelers have been documenting — whether you're in the mood for a beach day, a mountain hike, or just looking for the best local food in town.
          </p>
        </div>

        <div id="user-featured-places-slider" className="featured-places-slider-wrapper">
          <button 
            id="user-featured-prev-btn"
            onClick={prevSlide}
            className="featured-nav-btn featured-prev-btn"
          >
            <ChevronLeft className="nav-icon featured-nav-icon" />
          </button>
          
          <div id="user-featured-places-grid" className="featured-places-grid">
            <AnimatePresence mode="popLayout">
              {visiblePlaces.map((place) => (
                <motion.div 
                  id={`user-featured-place-${place.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <p className="featured-place-location">{place.location}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button 
            id="user-featured-next-btn"
            onClick={nextSlide}
            className="featured-nav-btn featured-next-btn"
          >
            <ChevronRight className="nav-icon featured-nav-icon" />
          </button>
        </div>

        <div id="user-featured-places-footer" className="featured-places-footer">
          <button id="user-share-travel-btn" className="share-travel-button">
            Share Your Travel
          </button>
        </div>
      </div>
    </section>
  );
};