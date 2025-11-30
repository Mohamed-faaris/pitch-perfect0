"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";

type ContactInfo = {
  icon: any;
  title: string;
  details: string[];
  action?: {
    label: string;
    href: string;
  };
};

const contactData: ContactInfo[] = [
  {
    icon: Phone,
    title: "Phone Numbers",
    details: ["+91 98765 43210", "+91 87654 32109"],
    action: {
      label: "Call Now",
      href: "tel:+919876543210",
    },
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@pitchperfect.com", "bookings@pitchperfect.com"],
    action: {
      label: "Send Email",
      href: "mailto:info@pitchperfect.com",
    },
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Sunday", "6:00 AM - 11:00 PM"],
  },
  {
    icon: MapPin,
    title: "Location",
    details: ["Aruppukottai", "Tamil Nadu", "India"],
    action: {
      label: "Get Directions",
      href: "https://maps.google.com",
    },
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with our team</p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-4">
          {contactData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                    {item.action && (
                      <Button asChild className="w-full">
                        <a
                          href={item.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.action.label}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Map Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                Find Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {/* Placeholder for map */}
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Map integration
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* WhatsApp Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground">
                Have questions about booking or our facilities?
                <br />
                Feel free to reach out anytime!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
