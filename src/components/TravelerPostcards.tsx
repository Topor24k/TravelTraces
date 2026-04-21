import { motion } from "motion/react";
import { travelerPostcards, getUserById } from "../data/mockDatabase";

type TravelerPostcardsProps = {
  onAuthRequired?: () => void;
  variant?: "public" | "user";
};

export const TravelerPostcards = ({ onAuthRequired, variant = "public" }: TravelerPostcardsProps) => {
  const postcards = travelerPostcards;
  const isUser = variant === "user";

  return (
    <section id={isUser ? "user-stories" : "stories"} className={isUser ? "relative w-full pt-10 pb-[30px] px-[75px]" : "traveler-postcards-section !pt-0 !pb-20"}>
      <div id={isUser ? "user-postcards-container" : "postcards-container"} className="traveler-postcards-container">
        <div id={isUser ? "user-postcards-header" : "postcards-header"} className="traveler-postcards-header">
          <h2 id={isUser ? "user-postcards-title" : "postcards-title"} className="traveler-postcards-title">Traveler Postcards</h2>
          <p id={isUser ? "user-postcards-description" : "postcards-description"} className="traveler-postcards-description">
            Snippets of real stories shared by our community. Every postcard is a memory etched into the map.
          </p>
        </div>

        <div id={isUser ? "user-postcards-grid" : "postcards-grid"} className="traveler-postcards-grid">
          {postcards.map((card, index) => {
            const owner = getUserById(card.ownerId);

            return (
            <motion.div 
              id={`${isUser ? "user-postcard" : "postcard"}-${index}`}
              key={card.id}
              onClick={isUser ? undefined : onAuthRequired}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: "0deg" }}
              style={{ rotate: card.rotation }}
              className="traveler-postcard-card"
            >
              <div className="postcard-image-wrapper">
                <img 
                  id={`${isUser ? "user-postcard-img" : "postcard-img"}-${index}`}
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

        <div id={isUser ? "user-postcards-footer" : "postcards-footer"} className="traveler-postcards-footer">
          <button id={isUser ? "user-view-all-stories-btn" : "view-all-stories-btn"} className="view-all-stories-button" onClick={isUser ? undefined : onAuthRequired}>
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};
