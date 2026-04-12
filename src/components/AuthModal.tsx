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
        className="auth-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          id="auth-modal-container"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="auth-modal-card bg-[#F4F3EE] w-full max-w-[500px] rounded-[30px] border border-black max-h-[90vh] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            id="auth-modal-close-btn"
            onClick={onClose}
            className="auth-modal-close-button absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
          >
            <X className="close-icon w-6 h-6" />
          </button>

          <div className="auth-modal-content p-6 sm:p-10">
            <div id="auth-modal-header" className="auth-modal-header-group flex flex-col gap-2 mb-6 sm:mb-8 mt-4 sm:mt-0">
              <h2 className="auth-modal-title font-limelight text-[40px] leading-tight">
                {mode === "signin" ? "Welcome Back" : "Join the Journey"}
              </h2>
              <p className="auth-modal-description font-life-savers text-lg opacity-60">
                {mode === "signin" 
                  ? "Sign in to continue your Philippine adventure." 
                  : "Create an account to start documenting your traces."}
              </p>
            </div>

            <form id="auth-modal-form" className="auth-modal-form-element flex flex-col gap-4 sm:gap-5" onSubmit={(e) => { e.preventDefault(); if (onLogin) onLogin(); }}>
              {mode === "signup" && (
                <>
                  <div className="form-field flex flex-col gap-1.5 sm:gap-2">
                    <label className="form-label font-life-savers text-sm font-bold uppercase tracking-wider opacity-50">Full Name</label>
                    <div className="input-wrapper relative">
                      <input 
                        id="auth-signup-name"
                        type="text" 
                        placeholder="Juan Dela Cruz"
                        className="form-input w-full bg-white border border-black/10 rounded-xl py-3 sm:py-4 pl-4 pr-4 font-life-savers focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>
                  <div className="form-field flex flex-col gap-1.5 sm:gap-2">
                    <label className="form-label font-life-savers text-sm font-bold uppercase tracking-wider opacity-50">Username</label>
                    <div className="input-wrapper relative">
                      <input 
                        id="auth-signup-username"
                        type="text" 
                        placeholder="juan_travels"
                        className="form-input w-full bg-white border border-black/10 rounded-xl py-3 sm:py-4 pl-4 pr-4 font-life-savers focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-field flex flex-col gap-1.5 sm:gap-2">
                <label className="form-label font-life-savers text-sm font-bold uppercase tracking-wider opacity-50">
                  {mode === "signin" ? "Email or Username" : "Email Address"}
                </label>
                <div className="input-wrapper relative">
                  <input 
                    id="auth-email-input"
                    type={mode === "signin" ? "text" : "email"} 
                    placeholder={mode === "signin" ? "juan@example.com or juan_travels" : "juan@example.com"}
                    className="form-input w-full bg-white border border-black/10 rounded-xl py-3 sm:py-4 pl-4 pr-4 font-life-savers focus:outline-none focus:border-black transition-colors min-w-0"
                  />
                </div>
              </div>

              <div className="form-field flex flex-col gap-1.5 sm:gap-2">
                <div className="label-group flex justify-between items-center">
                  <label className="form-label font-life-savers text-sm font-bold uppercase tracking-wider opacity-50">Password</label>
                  {mode === "signin" && (
                    <button id="auth-forgot-password-btn" type="button" className="forgot-password-link text-sm font-life-savers opacity-40 hover:opacity-100 transition-opacity">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="input-wrapper relative">
                  <input 
                    id="auth-password-input"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="form-input w-full bg-white border border-black/10 rounded-xl py-3 sm:py-4 pl-4 pr-14 font-life-savers focus:outline-none focus:border-black transition-colors min-w-0"
                  />
                  <button 
                    id="auth-password-toggle-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-button absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="toggle-icon w-5 h-5 opacity-40" /> : <Eye className="toggle-icon w-5 h-5 opacity-40" />}
                  </button>
                </div>
              </div>

              <button id="auth-submit-btn" className="auth-submit-button w-full bg-black text-white py-4 sm:py-5 rounded-xl font-life-savers text-lg sm:text-xl font-bold mt-2 sm:mt-4 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(255,251,221,1)]">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div id="auth-modal-footer" className="auth-modal-footer-group mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-black/5 text-center">
              <p className="footer-text font-life-savers text-lg">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                <button 
                  id="auth-mode-switch-btn"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="mode-switch-link ml-2 font-bold underline hover:opacity-70 transition-opacity"
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
