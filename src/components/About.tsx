import { motion } from "motion/react";
import { Search, MapPin, User } from "lucide-react";

export const About = () => {
  const pillars = [
    {
      title: "Community Driven",
      description: "Built by travelers, for travelers. Every pin and story is a contribution to a collective map of our islands.",
      icon: <User className="w-8 h-8" />
    },
    {
      title: "Authentic Discovery",
      description: "Find real experiences beyond the tourist traps. Discover hidden gems shared by locals and seasoned explorers.",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: "Digital Heritage",
      description: "Documenting our travels today creates a digital legacy of the Philippines' beauty for future generations.",
      icon: <MapPin className="w-8 h-8" />
    }
  ];

  return (
    <section id="about" className="about-section">
      {/* Background Decorative Elements */}
      <div id="about-bg-decoration-top" className="about-bg-decoration about-bg-decoration-top" />
      <div id="about-bg-decoration-bottom" className="about-bg-decoration about-bg-decoration-bottom" />

      <div id="about-content-container" className="about-content-container">
        <div id="about-grid" className="about-main-grid">
          {/* Left Side: Text Content */}
          <div id="about-text-column" className="about-text-column">
            <div id="about-header-group" className="about-header-group">
              <motion.span 
                id="about-subtitle"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="about-subtitle"
              >
                Our Story
              </motion.span>
              <motion.h2 
                id="about-main-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="about-main-title"
              >
                Documenting the <span className="italic">7,641</span> Islands
              </motion.h2>
              <motion.p 
                id="about-main-description"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="about-main-description"
              >
                TravelTraces was born from a simple belief: every corner of the Philippines has a story worth telling. We're building a digital sanctuary where the beauty of our archipelago is preserved through the eyes of those who explore it.
              </motion.p>
            </div>

            <div id="about-pillars-grid" className="about-pillars-grid">
              {pillars.map((pillar, index) => (
                <motion.div 
                  id={`about-pillar-${pillar.title.toLowerCase().replace(/\s+/g, '-')}`}
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="about-pillar-card"
                >
                  <div className="pillar-icon-wrapper">
                    {pillar.icon}
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-description">{pillar.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              id="about-founder-section"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="about-founder-section"
            >
              <p id="about-founder-quote" className="about-founder-quote">
                "This is just the beginning of a larger journey. Every pin you drop is a piece of the puzzle we're building together."
              </p>
              <div id="about-founder-profile" className="about-founder-profile">
                <div id="about-founder-avatar" className="about-founder-avatar">
                  <img src="/images/Profile.jpg" alt="Kayeen" className="founder-avatar-img" referrerPolicy="no-referrer" />
                </div>
                <div id="about-founder-info" className="about-founder-info">
                  <span id="about-founder-name" className="about-founder-name">Kayeen M. Campaña</span>
                  <span id="about-founder-role" className="about-founder-role">Founder & Developer</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Visual Element */}
          <div id="about-visual-column" className="about-visual-column">
            <motion.div 
              id="about-main-image-wrapper"
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="about-image-frame"
            >
              <img 
                id="about-main-image"
                src="/images/Profile.jpg"
                className="about-main-image"
                referrerPolicy="no-referrer"
              />
              <div id="about-image-overlay" className="about-image-overlay">
                <span className="about-image-location">Albay, Philippines</span>
                <span className="about-image-author">Documented by @kayeen_c</span>
              </div>
            </motion.div>

            {/* Floating Card */}
            <motion.div 
              id="about-floating-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="about-floating-card"
            >
              <div className="floating-card-content">
                <div id="about-user-avatars" className="user-avatars-group">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="user-avatar-item">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="user-avatar-more">
                    +1k
                  </div>
                </div>
                <p id="about-community-stat" className="community-stat-text">
                  Join 1,000+ explorers documenting our islands.
                </p>
              </div>
            </motion.div>

            {/* Decorative Background Box */}
            <div id="about-decorative-box" className="about-decorative-box" />
          </div>
        </div>
      </div>
    </section>
  );
};
