"use client"

import * as React from "react"

export default function LocationPreview() {
  return (
    <section className="mt-4">
      <h3 className="text-sm font-medium mb-2">Location</h3>
      <div className="rounded-lg overflow-hidden border">
        <iframe
          title="turf-location"
          width="100%"
          height={180}
          loading="lazy"
          src="https://www.google.com/maps?q=football%20turf&output=embed"
          className="block"
        />
      </div>
    </section>
  )
}
