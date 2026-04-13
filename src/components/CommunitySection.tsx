import { motion } from "motion/react";
import { Facebook, MessageCircle, Instagram, Twitter } from "lucide-react";

export const CommunitySection = () => {
  const socials = [
    { name: "Facebook", url: "#", icon: Facebook },
    { name: "Discord", url: "#", icon: MessageCircle },
    { name: "Instagram", url: "#", icon: Instagram },
    { name: "Twitter", url: "#", icon: Twitter },
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
          <h2 id="community-title" className="community-title">Share Us Through</h2>
          <p id="community-description" className="community-description">
            Help this project grow by sharing TravelTraces through your socials, communities, and friends who love exploring the Philippines.
          </p>
        </div>

        <div id="community-socials-grid" className="community-socials-grid">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a 
                id={`community-social-${social.name.toLowerCase()}`}
                key={social.name}
                href={social.url}
                className="community-social-card group"
              >
                <div className="social-icon-wrapper">
                  <Icon className="social-icon w-8 h-8" />
                </div>
                <span className="social-name">{social.name}</span>
              </a>
            );
          })}
        </div>
        
        <button id="community-join-btn" className="community-join-button">
          Join Community Now
        </button>
      </motion.div>
    </section>
  );
};
