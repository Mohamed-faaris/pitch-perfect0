"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Hero Banner */}
      <div className="relative h-64 w-full overflow-hidden rounded-b-3xl shadow-lg">
        <Image
          src="https://placehold.co/600x400/2563eb/ffffff?text=Turf+Hero"
          alt="Turf Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl font-bold">Pitch Perfect</h1>
          <p className="text-sm opacity-90">Premium Turf Experience</p>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="px-4">
        <Link href="/book">
          <Button size="lg" className="w-full text-lg font-semibold shadow-md">
            Book Now
          </Button>
        </Link>
      </div>

      {/* Location Preview */}
      <div className="px-4">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
          <MapPin className="h-5 w-5 text-primary" /> Location
        </h2>
        <Card className="overflow-hidden">
          <div className="relative h-40 w-full bg-muted">
             {/* Static Map Placeholder */}
             <Image
              src="https://placehold.co/600x300/e2e8f0/475569?text=Map+Preview"
              alt="Map Location"
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-3">
            <p className="text-sm text-muted-foreground">
              123 Sports Avenue, City Center
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Instructions (Carousel) */}
      <div className="px-4">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
          <Info className="h-5 w-5 text-primary" /> How to Book
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { title: "Select Date", desc: "Choose your preferred day" },
            { title: "Pick Slot", desc: "Find an available time" },
            { title: "Confirm", desc: "Pay and get your code" },
          ].map((step, i) => (
            <Card key={i} className="min-w-[200px] shrink-0 bg-secondary/50">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Turf Highlights */}
      <div className="px-4">
        <h2 className="mb-2 text-xl font-bold">Highlights</h2>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={`https://placehold.co/300x300/2563eb/ffffff?text=Photo+${i}`}
                alt={`Highlight ${i}`}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

