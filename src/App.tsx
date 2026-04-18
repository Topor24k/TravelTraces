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
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState("home");

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
              <section id="map" className="w-full px-3 md:px-5 lg:px-7 py-4">
                <div className="min-h-[calc(100vh-11.5rem)] px-3 md:px-8 max-w-7xl mx-auto text-center flex items-center justify-center">
                  <div className="w-full bg-white rounded-[20px] p-12 md:p-16 border border-black/10 shadow-sm flex flex-col items-center justify-center">
                    <h2 className="font-limelight text-4xl mb-4">Coming Soon</h2>
                    <p className="font-life-savers text-xl text-gray-500">We are currently building this feature. Check back later!</p>
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
