import { motion } from "motion/react";
import { MapPin } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div id="contact-grid" className="contact-main-grid">
        {/* Left Side: Message Me */}
        <motion.div 
          id="contact-form-column"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="contact-form-column"
        >
          <div id="contact-header" className="contact-header-group">
            <h2 id="contact-title" className="contact-title">Message Me</h2>
            <p id="contact-description" className="contact-description">
              Have any inquiries or just want to say hello? Drop a message below and I'll get back to you as soon as I can.
            </p>
          </div>

          <form id="contact-form" className="contact-form-element" onSubmit={(e) => e.preventDefault()}>
            <div className="form-field">
              <label className="form-label">Name</label>
              <input 
                id="contact-name-input"
                type="text" 
                placeholder="Your Name"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input 
                id="contact-email-input"
                type="email" 
                placeholder="your@email.com"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Message</label>
              <textarea 
                id="contact-message-input"
                rows={4}
                placeholder="Tell me something..."
                className="form-textarea"
              />
            </div>
            <button id="contact-submit-btn" className="contact-submit-button">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Right Side: Support the Project */}
        <motion.div 
          id="contact-support-column"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="contact-support-column"
        >
          <div id="support-header" className="support-header-group">
            <h3 id="support-title" className="support-title">Support the Project</h3>
            <p id="support-description" className="support-description">
              TravelTraces is a passion project built to celebrate the Philippines. If you find value in this platform, consider supporting its growth and maintenance. Every bit helps!
            </p>
          </div>
          <div id="support-actions" className="support-actions-group">
            <p id="support-quote" className="support-quote">"Helping us document all 7,641 islands, one story at a time."</p>
            <button id="donate-btn" className="donate-button">
              <MapPin className="donate-icon" />
              You Can Donate
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
