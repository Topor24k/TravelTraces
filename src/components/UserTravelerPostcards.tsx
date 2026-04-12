import { motion } from "motion/react";

export const UserTravelerPostcards = () => {
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
    <section id="user-stories" className="relative w-full pt-10 pb-[30px] px-[75px]">
      <div id="user-postcards-container" className="traveler-postcards-container">
        <div id="user-postcards-header" className="traveler-postcards-header">
          <h2 id="user-postcards-title" className="traveler-postcards-title">Traveler Postcards</h2>
          <p id="user-postcards-description" className="traveler-postcards-description">
            Snippets of real stories shared by our community. Every postcard is a memory etched into the map.
          </p>
        </div>

        <div id="user-postcards-grid" className="traveler-postcards-grid">
          {postcards.map((card, index) => (
            <motion.div 
              id={`user-postcard-${index}`}
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
                  id={`user-postcard-img-${index}`}
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

        <div id="user-postcards-footer" className="traveler-postcards-footer">
          <button id="user-view-all-stories-btn" className="view-all-stories-button">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};