"use client"

import * as React from "react"

const steps = [
  { title: "Choose Date", desc: "Pick a convenient date from the scroller." },
  { title: "Pick Time", desc: "Select an available slot from the list." },
  { title: "Pay Advance", desc: "Pay a small advance to confirm your booking." },
  { title: "Get Verified", desc: "Receive a 4-digit code and your booking ticket." },
]

export default function InstructionsCarousel() {
  return (
    <section className="mt-4">
      <h3 className="text-sm font-medium mb-2">How to Book</h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {steps.map((s, i) => (
          <div key={i} className="min-w-48 p-3 rounded-lg border bg-white dark:bg-slate-800">
            <div className="text-xs text-primary font-medium">Step {i + 1}</div>
            <div className="font-semibold mt-1">{s.title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
