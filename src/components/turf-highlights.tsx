"use client"

import * as React from "react"

const IMAGES = [
  "https://images.unsplash.com/photo-1508182310013-c5b5f6f5d4f2?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506619216599-9d16b2a66f4d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518600506278-4e8ef466b810?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=800&auto=format&fit=crop",
]

export default function TurfHighlights() {
  return (
    <section id="highlights" className="mt-4">
      <h3 className="text-sm font-medium">Turf Highlights</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {IMAGES.map((src, i) => (
          <div key={i} className="rounded overflow-hidden bg-slate-100">
            <img src={src} alt={`highlight-${i}`} className="w-full h-36 object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}
