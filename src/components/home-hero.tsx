"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"

export default function HomeHero() {
  return (
    <section className="relative w-full bg-slate-800/5 rounded-lg overflow-hidden">
      <div className="relative h-[220px] sm:h-[300px] bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508273730297-6e9c3a1f8e0b?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-2xl sm:text-3xl font-semibold">Pitch Perfect Turf</h1>
          <p className="mt-2 text-sm max-w-xl">Book your turf quickly — secure a slot, pay a small advance, and get on the pitch.</p>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <a href="/book">Book Now</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#highlights">Highlights</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
