import { motion } from "motion/react";
import { Map, MapPin, Share2 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    { 
      number: "01", 
      title: "Explore the Map", 
      description: "Navigate through our interactive 7,641-island map. Discover hidden gems and popular destinations across Luzon, Visayas, and Mindanao.",
      icon: <Map className="w-10 h-10" />
    },
    { 
      number: "02", 
      title: "Drop a Pin", 
      description: "Found a place you've visited? Drop a pin on the exact location to start documenting your unique travel experience.",
      icon: <MapPin className="w-10 h-10" />
    },
    { 
      number: "03", 
      title: "Share Your Trace", 
      description: "Upload photos, write your story, and share your 'trace' with a community of explorers. Inspire others to follow in your footsteps.",
      icon: <Share2 className="w-10 h-10" />
    }
  ];

  return (
    <section id="journey" className="how-it-works-section">
      <div id="how-it-works-container" className="how-it-works-container">
        <div id="how-it-works-header" className="how-it-works-header">
          <h2 id="how-it-works-title" className="how-it-works-title">The Journey</h2>
          <p id="how-it-works-description" className="how-it-works-description">
            Documenting the Philippines is as simple as exploring, pinning, and sharing. Here's how you can start your journey with us.
          </p>
        </div>

        <div id="how-it-works-steps" className="how-it-works-steps-grid">
          {steps.map((step, index) => (
            <motion.div 
              id={`how-it-works-step-${step.number}`}
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="how-it-works-step-card"
            >
              <div className="step-card-header">
                <span className="step-number">{step.number}</span>
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
