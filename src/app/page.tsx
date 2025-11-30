"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HeroBanner } from "~/components/hero-banner";
import { LocationPreview } from "~/components/location-preview";
import { InstructionsCarousel } from "~/components/instructions-carousel";
import { TurfHighlights } from "~/components/turf-highlights";

export default function Home() {
  return (
    <div className="min-h-screen pb-16">
      <HeroBanner />
      <div className="p-4 space-y-6">
        <Link href="/book">
          <Button className="w-full h-12 text-lg font-semibold">
            Book Now
          </Button>
        </Link>
        <LocationPreview />
        <InstructionsCarousel />
        <TurfHighlights />
      </div>
    </div>
  );
}
