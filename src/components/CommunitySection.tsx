import { motion } from "motion/react";
import { MapPin } from "lucide-react";

export const CommunitySection = () => {
  const socials = [
    { name: "Facebook", url: "#" },
    { name: "Discord", url: "#" },
    { name: "Instagram", url: "#" },
    { name: "Twitter", url: "#" },
  ];

  return (
    <section id="community" className="community-section">
      <motion.div 
        id="community-content-wrapper"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="community-content-wrapper"
      >
        <div id="community-header" className="community-header-group">
          <h2 id="community-title" className="community-title">Join Our Community</h2>
          <p id="community-description" className="community-description">
            Connect with fellow explorers, share your latest finds, and be part of our growing family of Filipino travelers.
          </p>
        </div>

        <div id="community-socials-grid" className="community-socials-grid">
          {socials.map((social) => (
            <a 
              id={`community-social-${social.name.toLowerCase()}`}
              key={social.name}
              href={social.url}
              className="community-social-card group"
            >
              <div className="social-icon-wrapper">
                <MapPin className="social-icon w-8 h-8" />
              </div>
              <span className="social-name">{social.name}</span>
            </a>
          ))}
        </div>
        
        <button id="community-join-btn" className="community-join-button">
          Join Community Now
        </button>
      </motion.div>
    </section>
  );
};
