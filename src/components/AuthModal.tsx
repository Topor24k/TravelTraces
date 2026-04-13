import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onLogin?: () => void;
}

export const AuthModal = ({ isOpen, onClose, initialMode = "signin", onLogin }: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        id="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="auth-modal-overlay"
        onClick={onClose}
      >
        <motion.div 
          id="auth-modal-container"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="auth-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            id="auth-modal-close-btn"
            onClick={onClose}
            className="auth-modal-close-button"
          >
            <X className="close-icon" />
          </button>

          <div className="auth-modal-content">
            <div id="auth-modal-header" className="auth-modal-header-group">
              <h2 className="auth-modal-title">
                {mode === "signin" ? "Welcome Back" : "Join the Journey"}
              </h2>
              <p className="auth-modal-description">
                {mode === "signin" 
                  ? "Sign in to continue your Philippine adventure." 
                  : "Create an account to start documenting your traces."}
              </p>
            </div>

            <form id="auth-modal-form" className="auth-modal-form-element" onSubmit={(e) => { e.preventDefault(); if (onLogin) onLogin(); }}>
              {mode === "signup" && (
                <>
                  <div className="auth-form-field">
                    <label className="auth-form-label">Full Name</label>
                    <div className="auth-input-wrapper">
                      <input 
                        id="auth-signup-name"
                        type="text" 
                        placeholder="Juan Dela Cruz"
                        className="auth-form-input"
                      />
                    </div>
                  </div>
                  <div className="auth-form-field">
                    <label className="auth-form-label">Username</label>
                    <div className="auth-input-wrapper">
                      <input 
                        id="auth-signup-username"
                        type="text" 
                        placeholder="juan_travels"
                        className="auth-form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="auth-form-field">
                <label className="auth-form-label">
                  {mode === "signin" ? "Email or Username" : "Email Address"}
                </label>
                <div className="auth-input-wrapper">
                  <input 
                    id="auth-email-input"
                    type={mode === "signin" ? "text" : "email"} 
                    placeholder={mode === "signin" ? "juan@example.com or juan_travels" : "juan@example.com"}
                    className="auth-form-input-min"
                  />
                </div>
              </div>

              <div className="auth-form-field">
                <div className="auth-label-group">
                  <label className="auth-form-label">Password</label>
                  {mode === "signin" && (
                    <button id="auth-forgot-password-btn" type="button" className="forgot-password-link">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrapper">
                  <input 
                    id="auth-password-input"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="auth-form-input-password"
                  />
                  <button 
                    id="auth-password-toggle-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-button"
                  >
                    {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>
              </div>

              <button id="auth-submit-btn" className="auth-submit-button">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div id="auth-modal-footer" className="auth-modal-footer-group">
              <p className="auth-footer-text">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                <button 
                  id="auth-mode-switch-btn"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="mode-switch-link"
                >
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
