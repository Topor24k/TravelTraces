/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { FeaturedPlaces } from "./components/FeaturedPlaces";
import { TravelerPostcards } from "./components/TravelerPostcards";
import { About } from "./components/About";
import { ContactSection } from "./components/ContactSection";
import { CommunitySection } from "./components/CommunitySection";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div id="app-root" className="app-root-container">
      <Header onJoinClick={() => setIsAuthModalOpen(true)} />
      <main id="main-content" className="main-content-wrapper">
        <Hero />
        <HowItWorks />
        <FeaturedPlaces />
        <TravelerPostcards />
        <About />
        <ContactSection />
        <CommunitySection />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
