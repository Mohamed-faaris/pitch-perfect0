"use client";

import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="pb-24 pt-4 min-h-screen bg-background">
      <h1 className="px-4 text-2xl font-bold mb-6">Contact Us</h1>

      <div className="px-4 space-y-6">
        {/* Contact Info */}
        <div className="grid gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">contact@pitchperfect.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Hours</p>
                <p className="font-semibold">6:00 AM - 11:00 PM</p>
                <p className="text-xs text-muted-foreground">Open 7 Days a Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp Button */}
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 py-6 text-lg"
          onClick={() => window.open("https://wa.me/919876543210", "_blank")}
        >
          <MessageCircle className="h-6 w-6" /> Chat on WhatsApp
        </Button>

        {/* Map Widget */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Location
          </h2>
          <div className="overflow-hidden rounded-xl border shadow-sm">
            <div className="relative h-64 w-full bg-muted">
              <Image
                src="https://placehold.co/600x400/e2e8f0/475569?text=Map+Location"
                alt="Map Location"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                <p className="font-semibold text-sm">Pitch Perfect Turf</p>
                <p className="text-xs text-muted-foreground">123 Sports Avenue, City Center</p>
                <Button variant="link" className="h-auto p-0 text-xs mt-1">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

