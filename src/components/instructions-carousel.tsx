"use client"

import * as React from "react"

const steps = [
  { title: "Choose Date", desc: "Pick a convenient date from the scroller." },
  { title: "Pick Time", desc: "Select an available slot from the list." },
  { title: "Pay Advance", desc: "Pay a small advance to confirm your booking." },
  { title: "Get Verified", desc: "Receive a 4-digit code and your booking ticket." },
]

export default function InstructionsCarousel() {
  const ref = React.useRef<HTMLDivElement | null>(null)

  return (
    <section className="mt-4">
      <h3 className="text-sm font-medium">How to Book</h3>
      <div className="mt-2 flex gap-3 overflow-x-auto no-scrollbar px-2" ref={ref}>
        {steps.map((s, i) => (
          <div key={i} className="min-w-[220px] p-3 rounded border bg-white/50">
            <div className="font-semibold">{s.title}</div>
            <div className="text-xs text-slate-600 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
