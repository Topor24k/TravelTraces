import { motion } from "motion/react";

export const TravelerPostcards = () => {
  const postcards = [
    { 
      image: "/images/Cloud%209%20Siargao.jpg", 
      caption: "Sunset at Siargao. Pure magic.", 
      author: "@island_soul",
      rotation: "-3deg"
    },
    { 
      image: "/images/Boracay.jpg", 
      caption: "Boracay's white sand is unbeatable.", 
      author: "@beach_lover",
      rotation: "2deg"
    },
    { 
      image: "/images/Chocolate%20Hills.jpg", 
      caption: "Chocolate Hills or giant truffles?", 
      author: "@sweet_travels",
      rotation: "-1deg"
    },
    { 
      image: "/images/El%20Nido%20Lagoons.jpg", 
      caption: "Crystal clear waters of El Nido.", 
      author: "@blue_voyager",
      rotation: "4deg"
    }
  ];

  return (
    <section id="stories" className="traveler-postcards-section">
      <div id="postcards-container" className="traveler-postcards-container">
        <div id="postcards-header" className="traveler-postcards-header">
          <h2 id="postcards-title" className="traveler-postcards-title">Traveler Postcards</h2>
          <p id="postcards-description" className="traveler-postcards-description">
            Snippets of real stories shared by our community. Every postcard is a memory etched into the map.
          </p>
        </div>

        <div id="postcards-grid" className="traveler-postcards-grid">
          {postcards.map((card, index) => (
            <motion.div 
              id={`postcard-${index}`}
              key={index}
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
                <span className="postcard-author">{card.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div id="postcards-footer" className="traveler-postcards-footer">
          <button id="view-all-stories-btn" className="view-all-stories-button">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};
