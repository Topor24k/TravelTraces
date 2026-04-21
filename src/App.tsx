/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { UserHeader } from "./components/UserHeader";
import { Hero } from "./components/Hero";
import { JourneyMarquee } from "./components/JourneyMarquee";
import { HowItWorks } from "./components/HowItWorks";
import { FeaturedPlaces } from "./components/FeaturedPlaces";
import { SharedPlaces } from "./components/SharedPlaces";
import { TravelerPostcards } from "./components/TravelerPostcards";
import { UserFeaturedPlaces } from "./components/UserFeaturedPlaces";
import { UserTravelerPostcards } from "./components/UserTravelerPostcards";
import { UserCommunitySection } from "./components/UserCommunitySection";
import { About } from "./components/About";
import { ContactSection } from "./components/ContactSection";
import { CommunitySection } from "./components/CommunitySection";
import { PhilippinesMap } from "./components/PhilippinesMap";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState("home");
  const [mapZoomLevel, setMapZoomLevel] = useState(1);
  const [isMapOverlayVisible, setIsMapOverlayVisible] = useState(true);

  return (
    <div id="app-root" className="app-root-container">
      {!isLoggedIn ? (
        <Header onJoinClick={() => setIsAuthModalOpen(true)} />
      ) : (
        <UserHeader 
          onLogout={() => setIsLoggedIn(false)} 
          activeUserTab={activeUserTab}
          setActiveUserTab={setActiveUserTab}
        />
      )}
      <main id="main-content" className="main-content-wrapper">
        {!isLoggedIn ? (
          <>
            <Hero onAuthRequired={() => setIsAuthModalOpen(true)} />
            <JourneyMarquee />
            <HowItWorks />
            <FeaturedPlaces onAuthRequired={() => setIsAuthModalOpen(true)} />
            <TravelerPostcards onAuthRequired={() => setIsAuthModalOpen(true)} />
            <About />
            <ContactSection />
            <CommunitySection />
          </>
        ) : (
          <div className="bg-[#F4F3EE]">
            {activeUserTab === "home" ? (
              <>
                <SharedPlaces onAddNewPlace={() => setActiveUserTab("map")} />
                <UserFeaturedPlaces />
                <UserTravelerPostcards />
              </>
            ) : activeUserTab === "map" ? (
              <section id="map" className="relative w-full pt-10 pb-[30px] px-[75px]">
                <div className="mx-auto flex min-h-[760px] h-[calc(100vh-176px)] w-full flex-col overflow-hidden rounded-[36px] border border-black/10 bg-[linear-gradient(180deg,#FAF8F0_0%,#F4F3EE_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                  {isMapOverlayVisible ? (
                    <div className="pointer-events-none absolute left-1/2 top-6 z-30 w-[min(980px,calc(100%-32px))] -translate-x-1/2">
                      <div className="pointer-events-auto rounded-[26px] border border-black/10 bg-[rgba(244,243,238,0.95)] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.10)] backdrop-blur-md md:p-5">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <p className="font-life-savers text-[11px] uppercase tracking-[0.32em] text-black/45">Interactive map</p>
                              <h2 className="font-limelight text-[40px] leading-[0.95] md:text-[48px]">Explore the Philippines</h2>
                              <p className="mt-1 max-w-[560px] font-life-savers text-sm text-black/55">
                                Use the zoom controls to scale the map while keeping the full geography accessible.
                              </p>
                            </div>

                              <div className="flex flex-col items-start gap-2 self-start md:items-end">
                                <button
                                  type="button"
                                  onClick={() => setIsMapOverlayVisible(false)}
                                  className="rounded-full border border-black/15 bg-white/90 px-3 py-1 font-life-savers text-xs text-black/70 transition-colors hover:bg-black/5"
                                >
                                  Hide panel
                                </button>

                                <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() => setMapZoomLevel((current) => Math.max(0.2, current - 0.15))}
                                    className="h-9 w-9 rounded-xl border border-black/10 bg-white font-life-savers text-lg leading-none transition-colors hover:bg-black/5"
                                    aria-label="Zoom out"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMapZoomLevel(1)}
                                    className="rounded-xl border border-black/10 bg-white px-3 py-1.5 font-life-savers text-xs"
                                    aria-label="Reset zoom"
                                  >
                                    {Math.round(mapZoomLevel * 100)}%
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMapZoomLevel((current) => Math.min(3, current + 0.15))}
                                    className="h-9 w-9 rounded-xl border border-black/10 bg-white font-life-savers text-lg leading-none transition-colors hover:bg-black/5"
                                    aria-label="Zoom in"
                                  >
                                    +
                                  </button>
                                </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <div className="rounded-2xl border border-black/10 bg-white/85 px-3 py-2.5 shadow-sm">
                              <p className="font-life-savers text-[10px] uppercase tracking-[0.18em] text-black/45">Municipalities</p>
                              <p className="font-limelight text-2xl leading-none">1,642</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/85 px-3 py-2.5 shadow-sm">
                              <p className="font-life-savers text-[10px] uppercase tracking-[0.18em] text-black/45">Provinces</p>
                              <p className="font-limelight text-2xl leading-none">88</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/85 px-3 py-2.5 shadow-sm">
                              <p className="font-life-savers text-[10px] uppercase tracking-[0.18em] text-black/45">Regions</p>
                              <p className="font-limelight text-2xl leading-none">17</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2">
                      <button
                        type="button"
                        onClick={() => setIsMapOverlayVisible(true)}
                        className="pointer-events-auto rounded-full border border-black/15 bg-[rgba(244,243,238,0.94)] px-4 py-2 font-life-savers text-sm text-black/75 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-[#F4F3EE]"
                      >
                        Show map panel
                      </button>
                    </div>
                  )}

                  <div className="map-explorer-scroll flex-1 overflow-auto">
                    <PhilippinesMap
                      id="user-philippines-map"
                      className="w-max min-w-full h-full overflow-visible bg-transparent flex justify-center"
                      variant="explorer"
                      zoomLevel={mapZoomLevel}
                      onZoomChange={setMapZoomLevel}
                      showZoomControls={false}
                    />
                  </div>
                </div>
              </section>
            ) : activeUserTab === "community" ? (
              <UserCommunitySection />
            ) : (
              <div className="min-h-screen pt-40 px-8 max-w-7xl mx-auto text-center">
                <div className="bg-white rounded-[20px] p-20 border border-black/10 shadow-sm flex flex-col items-center justify-center">
                  <h2 className="font-limelight text-4xl mb-4">Coming Soon</h2>
                  <p className="font-life-savers text-xl text-gray-500">We are currently building this feature. Check back later!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {!isLoggedIn && <Footer />}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={() => {
          setIsLoggedIn(true);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
