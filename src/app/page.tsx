import { LandingPageClient } from "~/app/_components/landing-page.client";
import { api } from "~/trpc/server";

export default async function Page() {
  let galleryItems: Awaited<ReturnType<typeof api.gallery.getAll>> = [];

  try {
    galleryItems = await api.gallery.getAll();
  } catch {
    galleryItems = [];
  }

  return <LandingPageClient galleryItems={galleryItems} />;
}
