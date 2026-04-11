import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { PhilippinesMap } from "./PhilippinesMap";

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Explore the Philippine Map",
      description: "Click on any island group — Luzon, Visayas, or Mindanao — and dive into a world of travel stories. Browse through other travelers' documentations of specific places, from hidden beaches to mountain peaks, and get inspired for your next adventure."
    },
    {
      title: "Drop Your Mark",
      description: "Found a gem? Click on the map, drop a pin exactly where your experience took place, and let that be the starting point of your story. No routes, no tracking — just you and the place that made your trip memorable."
    },
    {
      title: "Start Documenting",
      description: "Once your pin is placed, start building your documentation. Add photos, write about your experience, share tips, and let other travelers know what makes that spot special. Every pin becomes a personal entry in your Philippines album."
    },
    {
      title: "Build Your Philippines Album",
      description: "Every place you document gets saved to your personal album — a growing collection of all the spots you've visited across the archipelago. Your own travel diary, beautifully organized by island and location."
    },
    {
      title: "Discover Other Travelers' Stories",
      description: "Click any location on the map and see what other travelers have documented there. Real experiences, real places, shared by a community that loves the Philippines just as much as you do."
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="hero-section">
      <div id="hero-content-wrapper" className="hero-content-wrapper">
        <div id="hero-text-container" className="hero-text-container">
          <motion.div 
            id="hero-main-intro"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-intro-motion"
          >
            <div id="hero-title-group" className="hero-title-group">
              <h1 id="hero-main-title" className="hero-main-title">
                Discover and Share the Beauty of the Philippines
              </h1>
              <p id="hero-main-description" className="hero-main-description">
                From Luzon, Visayas, to Mindanao — 7,641 islands, endless adventures. Document your travels, create your personal Philippines album, and connect with fellow explorers who share the same love for this archipelago.
              </p>
              <div id="hero-divider" className="hero-divider-line"></div>
            </div>

            <div id="hero-secondary-intro" className="hero-secondary-intro">
              <h2 id="hero-secondary-title" className="hero-secondary-title">
                WHAT TO EXPECT?
              </h2>
              <p id="hero-secondary-description" className="hero-secondary-description">
                Everything you need to document, explore, and share the Philippines — one island at a time.
              </p>
            </div>
          </motion.div>

          <div id="hero-slider-container" className="hero-slider-container">
            <div id="hero-slider-card" className="hero-slider-card">
              <AnimatePresence mode="wait">
                <motion.div 
                  id={`hero-slide-${currentSlide}`}
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="hero-slide-content"
                >
                  <div className="hero-slide-inner">
                    <h3 className="hero-slide-title">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="hero-slide-description">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button 
              id="hero-slider-prev-btn"
              onClick={prevSlide}
              className="hero-slider-nav-btn hero-slider-prev-btn"
            >
              <ChevronLeft className="nav-icon w-8 h-8" />
            </button>
            <button 
              id="hero-slider-next-btn"
              onClick={nextSlide}
              className="hero-slider-nav-btn hero-slider-next-btn"
            >
              <ChevronRight className="nav-icon w-8 h-8" />
            </button>
          </div>
        </div>

        <div id="hero-map-container" className="hero-map-container">
          <motion.div
            id="hero-map-animation-wrapper"
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hero-map-motion-wrapper"
          >
            <PhilippinesMap 
              id="hero-philippines-map"
              className="hero-map-component"
              onRegionClick={(region) => {
                const notification = document.createElement('div');
                notification.id = 'region-click-notification';
                notification.className = 'region-notification';
                notification.innerText = `You clicked on ${region}! Exploring this area...`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
