import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

interface UserHeaderProps {
  onLogout: () => void;
  activeUserTab: string;
  setActiveUserTab: (tab: string) => void;
}

export const UserHeader = ({ onLogout, activeUserTab, setActiveUserTab }: UserHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: "My Shared Places", href: "#home", id: "home" },
    { name: "Map", href: "#map", id: "map" },
    { name: "Community", href: "#community", id: "community" },
  ];

  return (
    <header id="main-header" className="header-wrapper">
      <div className="header-inner-container">
        <div 
          id="header-logo" 
          className="header-logo-text w-1/4 cursor-pointer relative"
          onMouseEnter={() => setShowFooter(true)}
          onMouseLeave={() => setShowFooter(false)}
        >
          <span 
            onClick={() => {
              // Clicking toggles stickiness (technically just overrides hover or keeps it open vs close)
              // But requirements: "stick when i click and exit when i hover out"
              // A nice pattern: 
              setShowFooter(true);
            }}
          >
            TRAVELTRACES
          </span>
          <AnimatePresence>
            {showFooter && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 w-[400px] bg-white border border-black/10 z-50 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden cursor-default"
              >
                <div className="p-6">
                  <div className="font-lisu-bosa text-2xl mb-2">TRAVELTRACES</div>
                  <p className="font-life-savers text-gray-500 text-sm mb-6">
                    Documenting the beauty of the 7,641 islands of the Philippines, one story at a time.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold font-life-savers text-sm uppercase tracking-wider mb-3">Explore</h4>
                      <nav className="flex flex-col gap-2 font-life-savers text-gray-600 text-sm">
                        <a href="#explore" className="hover:text-black hover:underline">Luzon</a>
                        <a href="#explore" className="hover:text-black hover:underline">Visayas</a>
                        <a href="#explore" className="hover:text-black hover:underline">Mindanao</a>
                      </nav>
                    </div>
                    <div>
                      <h4 className="font-bold font-life-savers text-sm uppercase tracking-wider mb-3">Platform</h4>
                      <nav className="flex flex-col gap-2 font-life-savers text-gray-600 text-sm">
                        <a href="#about" className="hover:text-black hover:underline">About Us</a>
                        <a href="#contact" className="hover:text-black hover:underline">Contact</a>
                        <a href="#" className="hover:text-black hover:underline">Privacy Policy</a>
                      </nav>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex justify-between items-center bg-gray-50 -mx-6 -mb-6 p-6">
                    <span className="font-life-savers text-xs text-gray-500">© 2026 TravelTraces.</span>
                    <div className="flex gap-3">
                      {["Facebook", "Twitter", "Instagram"].map(social => (
                        <a key={social} href="#" className="text-gray-400 hover:text-black transition-colors font-life-savers text-xs">
                          {social}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div id="header-nav-container" className="header-nav-container flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.nav 
                id="header-navigation"
                key="nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="header-nav-links"
              >
                {navLinks.map((link) => (
                  <a 
                    id={`nav-link-${link.id}`}
                    key={link.id}
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveUserTab(link.id);
                    }}
                    className={`nav-link-item group relative ${activeUserTab === link.id ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                  >
                    {link.name}
                    {activeUserTab === link.id ? (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute -bottom-1 left-0 h-[2px] bg-black w-full"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                      />
                    ) : (
                      <span className="absolute -bottom-1 left-0 h-[2px] bg-black w-0 group-hover:w-full opacity-0 group-hover:opacity-30 transition-all duration-300"></span>
                    )}
                  </a>
                ))}
              </motion.nav>
            ) : (
              <motion.div 
                id="header-search-bar"
                key="search"
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.8 }}
                className="header-search-bar-active"
              >
                <Search className="search-icon" />
                <input 
                  id="header-search-input"
                  ref={searchInputRef}
                  placeholder="Search your next destination (e.g. Siargao, Batanes...)"
                  className="search-input-field"
                />
                <button 
                  id="header-search-close-btn"
                  className="search-close-button"
                  onClick={() => setIsSearchOpen(false)}
                >
                   <X className="close-icon w-6 h-6 text-black" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div id="header-actions" className="header-actions-group w-1/4 justify-end">
          {!isSearchOpen && (
            <div 
              id="header-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              className="search-trigger-icon"
            >
              <Search className="search-icon w-6 h-6" />
            </div>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 border border-black flex items-center justify-center shrink-0">
                 <span className="font-bold text-sm">KC</span>
              </div>
              <span className="hidden md:block font-life-savers font-bold text-sm whitespace-nowrap">Kayeen M. Campaña</span>
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-40 bg-white border border-black/10 rounded-[12px] shadow-sm py-2 z-50 text-black"
                >
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 font-life-savers text-sm hover:bg-gray-50 transition-colors"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};