import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

const socialIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  Discord: MessageCircle
};

export const Footer = () => (
  <footer id="main-footer" className="footer-wrapper">
    <div id="footer-content-container" className="footer-content-container">
      <div id="footer-main-grid" className="footer-main-grid">
        {/* Brand Column */}
        <div id="footer-brand-column" className="footer-brand-column">
          <div id="footer-logo" className="footer-logo-text">
            TRAVELTRACES
          </div>
          <p id="footer-brand-description" className="footer-brand-description">
            Documenting the beauty of the 7,641 islands of the Philippines, one story at a time. Join our community of explorers.
          </p>
          <div id="footer-social-links" className="footer-social-group flex gap-4">
            {Object.entries(socialIcons).map(([social, Icon]) => (
              <div 
                id={`footer-social-${social.toLowerCase()}`}
                key={social}
                className="footer-social-icon-wrapper group"
              >
                <Icon className="social-icon w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Columns */}
        <div id="footer-nav-grid" className="footer-nav-grid">
          <div id="footer-explore-nav" className="footer-nav-column">
            <h4 className="footer-nav-title">Explore</h4>
            <nav className="footer-nav-links">
              <a href="#explore" className="footer-nav-link">Luzon</a>
              <a href="#explore" className="footer-nav-link">Visayas</a>
              <a href="#explore" className="footer-nav-link">Mindanao</a>
              <a href="#explore" className="footer-nav-link">Hidden Gems</a>
            </nav>
          </div>
          <div id="footer-platform-nav" className="footer-nav-column">
            <h4 className="footer-nav-title">Platform</h4>
            <nav className="footer-nav-links">
              <a href="#about" className="footer-nav-link">About Us</a>
              <a href="#stories" className="footer-nav-link">Stories</a>
              <a href="#journey" className="footer-nav-link">Journey</a>
              <a href="#contact" className="footer-nav-link">Message Me</a>
              <a href="#community" className="footer-nav-link">Community</a>
            </nav>
          </div>
        </div>

        {/* Newsletter Column */}
        <div id="footer-newsletter-column" className="footer-newsletter-column">
          <div id="footer-newsletter-header" className="footer-newsletter-header">
            <h4 id="footer-newsletter-title" className="footer-newsletter-title">Subscribe to our Newsletter</h4>
            <p id="footer-newsletter-description" className="footer-newsletter-description">
              Get the latest travel stories and hidden gem discoveries delivered straight to your inbox.
            </p>
          </div>
          <form id="footer-newsletter-form" className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              id="footer-newsletter-input"
              type="email" 
              placeholder="Enter your email"
              className="footer-newsletter-input"
            />
            <button id="footer-newsletter-submit-btn" className="footer-newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div id="footer-bottom-bar" className="footer-bottom-bar">
        <p id="footer-copyright" className="footer-copyright-text">
          © 2026 TravelTraces. All rights reserved. Made with love for the Philippines.
        </p>
        <div id="footer-legal-links" className="footer-legal-links">
          <a id="footer-privacy-link" href="#" className="footer-legal-link">Privacy Policy</a>
          <a id="footer-terms-link" href="#" className="footer-legal-link">Terms of Service</a>
          <a id="footer-cookie-link" href="#" className="footer-legal-link">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);
