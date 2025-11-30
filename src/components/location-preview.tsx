"use client"

import * as React from "react"

export default function LocationPreview() {
  return (
    <section className="mt-4">
      <h3 className="text-sm font-medium">Location</h3>
      <div className="mt-2 rounded overflow-hidden border">
        <iframe
          title="turf-location"
          width="100%"
          height={200}
          loading="lazy"
          src="https://www.google.com/maps?q=football%20field&output=embed"
          className="block"
        />
      </div>
    </section>
  )
}
