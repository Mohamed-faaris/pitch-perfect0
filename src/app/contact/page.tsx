import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Manager 1:</span>
              <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1 234 567 890
              </a>
            </div>
            <div className="flex justify-between">
              <span>Manager 2:</span>
              <a href="tel:+0987654321" className="text-blue-600 hover:underline">
                +0 987 654 321
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a href="mailto:info@turfbooking.com" className="text-blue-600 hover:underline">
              info@turfbooking.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>6:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday - Sunday:</span>
              <span>5:00 AM - 11:00 PM</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center mb-2">
              <span className="text-muted-foreground">Map Widget Placeholder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              123 Turf Street, Sports City, SC 12345
            </p>
          </CardContent>
        </Card>

        <Button asChild className="w-full">
          <Link href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact on WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}