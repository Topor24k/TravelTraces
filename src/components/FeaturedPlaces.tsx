import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { featuredPublicPlacePosts, getUserById } from "../data/mockDatabase";

type FeaturedPlacesProps = {
  onAuthRequired?: () => void;
  variant?: "public" | "user";
};

export const FeaturedPlaces = ({ onAuthRequired, variant = "public" }: FeaturedPlacesProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const allPlaces = featuredPublicPlacePosts;

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % (allPlaces.length - 3));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + (allPlaces.length - 3)) % (allPlaces.length - 3));
  };

  const visiblePlaces = allPlaces.slice(startIndex, startIndex + 4);
  const isUser = variant === "user";

  return (
    <section id={isUser ? "user-explore" : "explore"} className={isUser ? "user-featured-places-section" : "featured-places-section !py-10"}>
      <div id={isUser ? "user-featured-places-container" : "featured-places-container"} className="featured-places-container">
        <div id={isUser ? "user-featured-places-header" : "featured-places-header"} className="featured-places-header-group">
          <h2 id={isUser ? "user-featured-places-title" : "featured-places-title"} className="featured-places-title">Featured Top Places</h2>
          <p id={isUser ? "user-featured-places-description" : "featured-places-description"} className="featured-places-description">
            Not sure where to start? Browse through categories and see what other travelers have been documenting — whether you're in the mood for a beach day, a mountain hike, or just looking for the best local food in town.
          </p>
        </div>

        <div id={isUser ? "user-featured-places-slider" : "featured-places-slider"} className="featured-places-slider-wrapper">
          <button 
            id={isUser ? "user-featured-prev-btn" : "featured-prev-btn"}
            onClick={prevSlide}
            className="featured-nav-btn featured-prev-btn"
          >
            <ChevronLeft className={isUser ? "nav-icon featured-nav-icon" : "nav-icon w-8 h-8"} />
          </button>
          
          <div id={isUser ? "user-featured-places-grid" : "featured-places-grid"} className="featured-places-grid">
            <AnimatePresence mode="popLayout">
              {visiblePlaces.map((place) => {
                const owner = getUserById(place.ownerId);

                return (
                <motion.div 
                  id={`${isUser ? "user-featured-place" : "featured-place"}-${place.placeName.toLowerCase().replace(/\s+/g, '-')}`}
                  key={place.id}
                  onClick={isUser ? undefined : onAuthRequired}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -15 }}
                  className="featured-place-card group"
                >
                  <img 
                    src={place.image}
                    alt={place.placeName}
                    className="featured-place-image"
                    referrerPolicy="no-referrer"
                  />
                  <div className="featured-place-overlay" />
                  <div className="featured-place-info">
                    <h4 className="featured-place-name">{place.placeName}</h4>
                    <p className="featured-place-location">{place.location}</p>
                    <p className="font-life-savers text-[13px] opacity-80 mt-1">By {owner?.name ?? "Unknown Traveler"}</p>
                  </div>
                </motion.div>
              );})}
            </AnimatePresence>
          </div>

          <button 
            id={isUser ? "user-featured-next-btn" : "featured-next-btn"}
            onClick={nextSlide}
            className="featured-nav-btn featured-next-btn"
          >
            <ChevronRight className={isUser ? "nav-icon featured-nav-icon" : "nav-icon w-8 h-8"} />
          </button>
        </div>

        <div id={isUser ? "user-featured-places-footer" : "featured-places-footer"} className="featured-places-footer">
          <button id={isUser ? "user-share-travel-btn" : "share-travel-btn"} className="share-travel-button" onClick={isUser ? undefined : onAuthRequired}>
            Share Your Travel
          </button>
        </div>
      </div>
    </section>
  );
};
