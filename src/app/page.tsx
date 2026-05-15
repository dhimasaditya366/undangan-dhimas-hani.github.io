"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OpeningVideo } from "@/components/OpeningVideo";
import { HeroSection } from "@/components/HeroSection";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CoupleSection } from "@/components/CoupleSection";
import { EventSection } from "@/components/EventSection";
import { Gallery } from "@/components/Gallery";
import { StoryOfUs } from "@/components/StoryOfUs";
import { LocationSection } from "@/components/LocationSection";
import { RSVPForm } from "@/components/RSVPForm";
import { WishesWall } from "@/components/WishesWall";
import { DressCode } from "@/components/DressCode";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <ScrollProgress />
      <MusicPlayer />
      
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className={isLoading ? "opacity-0 h-screen overflow-hidden" : "opacity-100 transition-opacity duration-1000"}>
        <OpeningVideo />
        <HeroSection />
        <CountdownTimer />
        <CoupleSection />
        <EventSection />
        <StoryOfUs />
        <Gallery />
        <LocationSection />
        <RSVPForm />
        <WishesWall />
        <DressCode />
        <Footer />
      </div>
    </main>
  );
}
