import { motion } from "motion/react";
import { travelerPostcards, getUserById } from "../data/mockDatabase";

export const TravelerPostcards = ({ onAuthRequired }: { onAuthRequired?: () => void }) => {
  const postcards = travelerPostcards;

  return (
    <section id="stories" className="traveler-postcards-section !pt-0 !pb-20">
      <div id="postcards-container" className="traveler-postcards-container">
        <div id="postcards-header" className="traveler-postcards-header">
          <h2 id="postcards-title" className="traveler-postcards-title">Traveler Postcards</h2>
          <p id="postcards-description" className="traveler-postcards-description">
            Snippets of real stories shared by our community. Every postcard is a memory etched into the map.
          </p>
        </div>

        <div id="postcards-grid" className="traveler-postcards-grid">
          {postcards.map((card, index) => {
            const owner = getUserById(card.ownerId);

            return (
            <motion.div 
              id={`postcard-${index}`}
              key={card.id}
              onClick={onAuthRequired}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: "0deg" }}
              style={{ rotate: card.rotation }}
              className="traveler-postcard-card"
            >
              <div className="postcard-image-wrapper">
                <img 
                  id={`postcard-img-${index}`}
                  src={card.image} 
                  alt={card.caption} 
                  className="postcard-image"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="postcard-content">
                <p className="postcard-caption">"{card.caption}"</p>
                <span className="postcard-author">{owner?.handle ?? "@traveler"}</span>
              </div>
            </motion.div>
          );})}
        </div>

        <div id="postcards-footer" className="traveler-postcards-footer">
          <button id="view-all-stories-btn" className="view-all-stories-button" onClick={onAuthRequired}>
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};
