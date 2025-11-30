"use client"

import * as React from "react"

const IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop",
]

export default function TurfHighlights() {
  return (
    <section id="highlights" className="mt-4">
      <h3 className="text-sm font-medium mb-2">Turf Highlights</h3>
      <div className="grid grid-cols-2 gap-2">
        {IMAGES.map((src, i) => (
          <div key={i} className="rounded-lg overflow-hidden bg-slate-100 aspect-square">
            <img src={src} alt={`highlight-${i}`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}
