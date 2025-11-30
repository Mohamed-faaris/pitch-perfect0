"use client";

import HomeHero from "~/components/home-hero";
import LocationPreview from "~/components/location-preview";
import InstructionsCarousel from "~/components/instructions-carousel";
import TurfHighlights from "~/components/turf-highlights";

export default function Home() {
  return (
    <main className="px-4 pb-28">
      <HomeHero />

      <div className="mt-4">
        <LocationPreview />
      </div>

      <div className="mt-4">
        <InstructionsCarousel />
      </div>

      <div className="mt-4">
        <TurfHighlights />
      </div>
    </main>
  );
}
