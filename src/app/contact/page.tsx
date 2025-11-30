"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"
import LocationPreview from "~/components/location-preview"

export default function ContactPage() {
  const phone = "+919876543210"
  const altPhone = "+919812345678"
  const email = "info@pitchperfect.com"
  const whatsapp = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello, I want to inquire about turf bookings"
  )}`

  return (
    <main className="px-4 pb-28">
      <h2 className="text-xl font-semibold">Contact</h2>

      <section className="mt-4">
        <div className="rounded-lg border p-4 bg-white/50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">Phone</div>
              <div className="mt-1 text-sm">
                <a className="text-primary" href={`tel:${phone}`}>{phone}</a>
              </div>
              <div className="mt-1 text-sm">Alt: <a className="text-primary" href={`tel:${altPhone}`}>{altPhone}</a></div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <a href={`tel:${phone}`}>Call</a>
              </Button>
              <Button asChild>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">Email</div>
            <div className="mt-1 text-sm"><a className="text-primary" href={`mailto:${email}`}>{email}</a></div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">Business Hours</div>
            <div className="mt-1 text-sm">Mon - Sun: 6:00 AM — 10:00 PM</div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-medium">Location</h3>
        <div className="mt-2">
          <LocationPreview />
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Manage & Support</h3>
        <div className="mt-2 text-sm text-slate-600">For group bookings, events or sponsorships, email the management or call the number above.</div>
      </section>
    </main>
  )
}
