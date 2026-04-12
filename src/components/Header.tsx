import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

interface HeaderProps {
  onJoinClick: () => void;
}

export const Header = ({ onJoinClick }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "journey", "explore", "stories", "about", "contact", "community"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Journey", href: "#journey", id: "journey" },
    { name: "Explore", href: "#explore", id: "explore" },
    { name: "Stories", href: "#stories", id: "stories" },
    { name: "About", href: "#about", id: "about" },
    { name: "Message Me", href: "#contact", id: "contact" },
    { name: "Community", href: "#community", id: "community" },
  ];

  return (
    <header id="main-header" className="header-wrapper">
      <div className="header-inner-container">
        <div id="header-logo" className="header-logo-text">
          TRAVELTRACES
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
                    onClick={() => setActiveSection(link.id)}
                    className={`nav-link-item group relative ${activeSection === link.id ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
                  >
                    {link.name}
                    {activeSection === link.id ? (
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

        <div id="header-actions" className="header-actions-group">
          {!isSearchOpen && (
            <div 
              id="header-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              className="search-trigger-icon"
            >
              <Search className="search-icon w-6 h-6" />
            </div>
          )}
          <button 
            id="header-join-us-btn"
            onClick={onJoinClick}
            className="join-us-button"
          >
            Join Us
          </button>
        </div>
      </div>
    </header>
  );
};
