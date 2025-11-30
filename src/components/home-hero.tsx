"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"

export default function HomeHero() {
  return (
    <section className="relative w-full rounded-xl overflow-hidden">
      <div
        className="relative h-52 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1400&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-2xl font-bold">Pitch Perfect Turf</h1>
          <p className="mt-2 text-sm max-w-xs">Book your turf quickly — secure a slot, pay a small advance, and get on the pitch.</p>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <a href="/book">Book Now</a>
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/20" asChild>
              <a href="#highlights">Highlights</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
