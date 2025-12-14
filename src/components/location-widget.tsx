"use client";

import { Card } from "~/components/ui/card";

interface LocationWidgetProps {
  title?: string;
  address?: string;
  hours?: string;
}

const FALLBACK = { lat: 9.5097955, lng: 78.1113851 };
const MAP_LINK = "https://maps.app.goo.gl/GtWnLZFP5PJL9cwb8";

export function LocationWidget({
  title = "Pitch Perfect",
  address = "12/4A, Pitch Perfect Turf, Aruppukottai Main Road, Tamil Nadu.",
  hours,
}: LocationWidgetProps) {
  const coords = FALLBACK;

  // If the provided link is a short maps link (maps.app.goo.gl / goo.gl),
  // use a coordinate-based embed URL as a reliable fallback for the iframe.
  // Keep the original short link for the external "Open in Google Maps" anchor.
  const embedSrc =
    MAP_LINK.includes("goo.gl") || MAP_LINK.includes("maps.app.goo.gl")
      ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`
      : MAP_LINK;

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-video">
        <iframe
          title="Location map"
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>
      <div className="text-muted-foreground p-4 text-sm">
        <p>{address}</p>
        {title && <p className="text-foreground mt-2 font-medium">{title}</p>}
        {hours && <p className="text-foreground mt-2">{hours}</p>}
        {/* <p className="mt-2">
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Open in Google Maps
          </a>
        </p> */}
      </div>
    </Card>
  );
}
