"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  Home,
  Images,
  MapPin,
  PhoneCall,
  TicketIcon,
  Clock4,
  ShieldCheck,
  Download,
  RefreshCcw,
  PartyPopper,
} from "lucide-react";
import { addDays, format, isAfter, parseISO } from "date-fns";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { ThemeToggle } from "~/components/theme-toggle";

type TabKey = "home" | "book" | "view" | "gallery" | "contact";
type Language = "en" | "ta";

type Ticket = {
  id: string;
  bookingId?: string;
  slotId: number;
  date: string;
  from: string;
  to: string;
  name: string;
  phone: string;
  email?: string;
  alternateContactName?: string;
  alternateContactNumber?: string;
  amountPaid: number;
  paymentMode: "advance" | "full";
  verificationCode: string;
  status: string;
  createdAt: string;
};

type BookingFormState = {
  name: string;
  number: string;
  email: string;
  alternateContactName: string;
  alternateContactNumber: string;
};

const NAV_ITEMS: { key: TabKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "view", label: "View", icon: TicketIcon },
  { key: "book", label: "Book", icon: CalendarDays },
  { key: "gallery", label: "Gallery", icon: Images },
  { key: "contact", label: "Contact", icon: PhoneCall },
];

const LANGUAGE_OPTIONS: { id: Language; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "ta", label: "TA" },
];

const INSTRUCTIONS = [
  {
    title: "Pick a slot",
    copy: "Scroll through upcoming days and choose a time that matches your squad.",
  },
  {
    title: "Lock payment",
    copy: "Pay ₹100 to reserve instantly or settle ₹800 for a full block.",
  },
  {
    title: "Show & play",
    copy: "Arrive 10 mins early, show the verification code and you are set.",
  },
];

const HIGHLIGHTS = [
  {
    title: "Pro Turf",
    copy: "FIFA-sized nets, shock-absorbing grass and perfect night lights.",
    image: "https://picsum.photos/seed/turf1/400/280",
  },
  {
    title: "Hydration Bar",
    copy: "Cold-pressed juices and recovery drinks available all night.",
    image: "https://picsum.photos/seed/turf2/400/280",
  },
  {
    title: "Coaching",
    copy: "Weekend clinics for kids and corporate performance bootcamps.",
    image: "https://picsum.photos/seed/turf3/400/280",
  },
];

const GALLERY = Array.from({ length: 8 }).map((_, index) => ({
  id: `gallery-${index}`,
  src: `https://picsum.photos/seed/gallery${index}/420/520`,
  label: index % 2 === 0 ? "Match Night" : "Training",
}));

const CONTACT_INFO = {
  phones: [
    { label: "Front Desk", value: "+91 90909 23232" },
    { label: "Manager", value: "+91 99524 44556" },
  ],
  email: "play@pitchperfect.turf",
  hours: "Mon - Sun · 5 AM to 1 AM",
  whatsapp: "https://wa.me/919090923232",
  mapsLink: "https://maps.app.goo.gl/1g5YwNwDbTurf",
};

const PURPOSE_OPTIONS = [
  { id: "cricket", label: "Cricket", helper: "Leather / tennis" },
  { id: "booking", label: "Full Booking", helper: "Birthdays & events" },
];

const PAYMENT_OPTIONS = [
  { id: "advance", label: "₹100 Advance", amount: 100 },
  { id: "full", label: "₹800 Full", amount: 800 },
];

const HERO_VIDEO = "https://cdn.coverr.co/videos/coverr-football-players-warming-up-4408/1080p.mp4";

const buildDateRange = (days = 7) =>
  Array.from({ length: days }).map((_, index) => {
    const date = addDays(new Date(), index);
    return {
      label: format(date, "EEE"),
      display: format(date, "d MMM"),
      value: format(date, "yyyy-MM-dd"),
    };
  });

const combineDateTime = (date: string, time: string) => {
  const dateObj = parseISO(date);
  const [hours, minutes, seconds] = time.split(":").map(Number);
  dateObj.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0, 0);
  return dateObj;
};

const formatSlotLabel = (from: string, to: string) => {
  const fromDate = combineDateTime("1970-01-01", from);
  const toDate = combineDateTime("1970-01-01", to);
  return `${format(fromDate, "h:mm a")} – ${format(toDate, "h:mm a")}`;
};

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const dateOptions = useMemo(() => buildDateRange(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<"advance" | "full" | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    name: "",
    number: "",
    email: "",
    alternateContactName: "",
    alternateContactNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [lookupNumber, setLookupNumber] = useState<string | null>(null);
  const [viewPhone, setViewPhone] = useState<string>("");

  useEffect(() => {
    if (!selectedDate && dateOptions.length) {
      setSelectedDate(dateOptions[0]?.value ?? null);
    }
  }, [dateOptions, selectedDate]);

  useEffect(() => {
    setSelectedSlotId(null);
    setPurpose(null);
    setPaymentChoice(null);
  }, [selectedDate]);

  const slotsQuery = api.timeSlot.getAllByDate.useQuery(
    { date: selectedDate ?? "" },
    { enabled: Boolean(selectedDate) }
  );

  const createCustomerMutation = api.customer.create.useMutation();
  const updateCustomerMutation = api.customer.update.useMutation();
  const bookingMutation = api.booking.book.useMutation();

  const bookingHistoryQuery = api.booking.getByNumber.useQuery(
    { number: lookupNumber ?? "" },
    { enabled: Boolean(lookupNumber) }
  );

  const customerLookupQuery = api.customer.getByPhoneNumber.useQuery(
    { phoneNumber: lookupNumber ?? "" },
    { enabled: Boolean(lookupNumber) }
  );

  const mergedTickets = useMemo(() => {
    const remoteTickets: Ticket[] = (bookingHistoryQuery.data ?? []).map((booking) => {
      const slotFrom = booking.timeSlot?.from ?? "00:00:00";
      const slotTo = booking.timeSlot?.to ?? "00:00:00";
      return {
        id: booking.id,
        bookingId: booking.id,
        slotId: booking.timeSlotId,
        date: booking.timeSlot?.date ?? format(new Date(), "yyyy-MM-dd"),
        from: slotFrom,
        to: slotTo,
        name: customerLookupQuery.data?.name ?? booking.phoneNumber,
        phone: booking.phoneNumber,
        amountPaid: booking.amountPaid / 100,
        paymentMode: booking.status === "fullPaid" ? "full" : "advance",
        verificationCode: booking.id.slice(0, 4).toUpperCase(),
        status: booking.status,
        createdAt: booking.createdAt?.toString() ?? new Date().toISOString(),
      } satisfies Ticket;
    });

    const remoteIds = new Set(remoteTickets.map((ticket) => ticket.id));
    const localOnly = tickets.filter((ticket) => !remoteIds.has(ticket.id));

    return [...remoteTickets, ...localOnly].sort((a, b) => {
      const aDate = combineDateTime(a.date, a.from);
      const bDate = combineDateTime(b.date, b.from);
      return bDate.getTime() - aDate.getTime();
    });
  }, [bookingHistoryQuery.data, customerLookupQuery.data, tickets]);

  const now = new Date();
  const upcomingTickets = mergedTickets.filter((ticket) =>
    isAfter(combineDateTime(ticket.date, ticket.from), now)
  );
  const pastTickets = mergedTickets.filter((ticket) =>
    !isAfter(combineDateTime(ticket.date, ticket.from), now)
  );

  const canPickExtras = Boolean(selectedDate && selectedSlotId);
  const isFormValid = Boolean(
    selectedDate &&
    selectedSlotId &&
    canPickExtras &&
    purpose &&
    paymentChoice &&
    bookingForm.name.trim() &&
    bookingForm.number.trim() &&
    bookingForm.alternateContactName.trim() &&
    bookingForm.alternateContactNumber.trim()
  );

  const handleFieldChange = (field: keyof BookingFormState, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const ensureCustomer = useCallback(async () => {
    try {
      await createCustomerMutation.mutateAsync({
        name: bookingForm.name,
        number: bookingForm.number,
        email: bookingForm.email || `${bookingForm.number}@pitch-perfect.fake`,
        alternateContactName: bookingForm.alternateContactName,
        alternateContactNumber: bookingForm.alternateContactNumber,
        languagePreference: "en",
      });
    } catch {
      await updateCustomerMutation.mutateAsync({
        phoneNumber: bookingForm.number,
        name: bookingForm.name,
        email: bookingForm.email || `${bookingForm.number}@pitch-perfect.fake`,
        alternateContactName: bookingForm.alternateContactName,
        alternateContactNumber: bookingForm.alternateContactNumber,
        languagePreference: "en",
      });
    }
  }, [bookingForm, createCustomerMutation, updateCustomerMutation]);

  const launchConfetti = useCallback(() => {
    const duration = 2000;
    const colors = ["#38bdf8", "#facc15", "#f472b6", "#a855f7"];
    const end = Date.now() + duration;

    const frame = () => {
      if (Date.now() > end) return;
      void confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      void confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const drawTicketCanvas = (ticket: Ticket) => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0ea5e9");
    gradient.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "48px 'Geist', sans-serif";
    ctx.fillText("Pitch Perfect Turf", 80, 120);

    ctx.font = "70px 'Geist', sans-serif";
    ctx.fillText(ticket.verificationCode, 80, 210);

    ctx.font = "36px 'Geist', sans-serif";
    ctx.fillText(`Booking ID: ${ticket.bookingId ?? ticket.id}`, 80, 270);

    const details = [
      `Player: ${ticket.name}`,
      `Phone: ${ticket.phone}`,
      `Date: ${format(parseISO(ticket.date), "EEE, d MMM yyyy")}`,
      `Time: ${formatSlotLabel(ticket.from, ticket.to)}`,
      `Amount Paid: ₹${ticket.amountPaid}`,
      `Mode: ${ticket.paymentMode === "full" ? "Full" : "Advance"}`,
      `Status: ${ticket.status}`,
    ];

    details.forEach((detail, index) => {
      ctx.fillText(detail, 80, 340 + index * 45);
    });

    ctx.font = "32px 'Geist', sans-serif";
    ctx.fillText("Show this code at the turf gate", 80, 600);

    return canvas;
  };

  const downloadTicketAsImage = (ticket: Ticket) => {
    const canvas = drawTicketCanvas(ticket);
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${ticket.bookingId ?? ticket.id}.png`;
    link.click();
  };

  const downloadTicketAsPdf = (ticket: Ticket) => {
    const canvas = drawTicketCanvas(ticket);
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    doc.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
    doc.save(`${ticket.bookingId ?? ticket.id}.pdf`);
  };

  const handlePayNow = async () => {
    if (!isFormValid || !selectedSlotId || !selectedDate || !paymentChoice) return;
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    try {
      await ensureCustomer();
      const bookingResponse = await bookingMutation.mutateAsync({
        number: bookingForm.number,
        timeSlotIds: [selectedSlotId],
        paymentType: paymentChoice === "full" ? "full" : "advance",
      });

      const slot = slotsQuery.data?.find((entry) => entry.id === selectedSlotId);
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const ticket: Ticket = {
        id: bookingResponse[0]?.id ?? crypto.randomUUID(),
        bookingId: bookingResponse[0]?.id,
        slotId: selectedSlotId,
        date: selectedDate,
        from: slot?.from ?? "00:00:00",
        to: slot?.to ?? "00:00:00",
        name: bookingForm.name,
        phone: bookingForm.number,
        email: bookingForm.email || undefined,
        alternateContactName: bookingForm.alternateContactName,
        alternateContactNumber: bookingForm.alternateContactNumber,
        amountPaid: paymentChoice === "full" ? 800 : 100,
        paymentMode: paymentChoice,
        verificationCode,
        status: paymentChoice === "full" ? "fullPaid" : "advancePaid",
        createdAt: new Date().toISOString(),
      };

      setTickets((prev) => [ticket, ...prev]);
      setActiveTicket(ticket);
      setFormSuccess("Booking locked! Check the ticket below.");
      setBookingForm({
        name: "",
        number: "",
        email: "",
        alternateContactName: "",
        alternateContactNumber: "",
      });
      setPurpose(null);
      setPaymentChoice(null);
      setSelectedSlotId(null);
      launchConfetti();
      await slotsQuery.refetch();
    } catch (error) {
      console.error(error);
      setFormError("Booking failed. Please retry after checking the details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHero = () => (
    <Card className="overflow-hidden border-none bg-linear-to-b from-primary to-primary/70 text-white">
      <div className="relative h-56 w-full overflow-hidden">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://picsum.photos/seed/turf-hero/1200/800"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Pitch Perfect Turf</p>
          <h1 className="text-3xl font-semibold leading-tight">Book night matches in 3 taps</h1>
          <div className="flex flex-wrap gap-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="size-4" />Verified slots</span>
            <span className="inline-flex items-center gap-1"><Clock4 className="size-4" />24x7</span>
          </div>
        </div>
      </div>
      <CardFooter className="flex flex-col gap-3 pb-6">
        <Button
          className="w-full rounded-full text-base"
          size="lg"
          onClick={() => setActiveTab("book")}
        >
          Book Now
        </Button>
        <p className="text-sm text-white/70">
          Instant confirmation with verification codes and downloadable ticket.
        </p>
      </CardFooter>
    </Card>
  );

  const renderLocation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="size-5 text-primary" /> Location
        </CardTitle>
        <CardDescription>Aruppukottai Ring Road, opposite SR Sports Complex.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-44 w-full overflow-hidden rounded-xl">
          <Image
            src="https://placehold.co/600x300?text=Turf+Location"
            alt="Map preview"
            fill
            className="object-cover"
          />
        </div>
        <Button variant="outline" className="w-full" asChild>
          <a href={CONTACT_INFO.mapsLink} target="_blank" rel="noreferrer">
            Navigate with Google Maps
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  const renderInstructions = () => (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <BadgeCheck className="size-5 text-primary" />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          How it works
        </p>
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {INSTRUCTIONS.map((instruction) => (
          <motion.div
            key={instruction.title}
            whileHover={{ y: -4 }}
            className="min-w-60 flex-1 snap-center"
          >
            <Card className="h-full bg-accent/50">
              <CardHeader>
                <CardTitle className="text-base">{instruction.title}</CardTitle>
                <CardDescription>{instruction.copy}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const renderHighlights = () => (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Camera className="size-5 text-primary" />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Highlights
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {HIGHLIGHTS.map((highlight) => (
          <Card key={highlight.title} className="overflow-hidden">
            <div className="relative h-44 w-full">
              <Image src={highlight.image} alt={highlight.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{highlight.title}</CardTitle>
              <CardDescription>{highlight.copy}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderDateSelector = () => (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {dateOptions.map((date) => {
        const isSelected = selectedDate === date.value;
        return (
          <button
            key={date.value}
            onClick={() => setSelectedDate(date.value)}
            className={cn(
              "flex min-w-[86px] flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-sm transition-all",
              isSelected
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border text-foreground/70"
            )}
          >
            <span className="font-semibold">{date.label}</span>
            <span>{date.display}</span>
            {isSelected && <span className="h-1 w-6 rounded-full bg-primary" />}
          </button>
        );
      })}
    </div>
  );

  const renderSlots = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Available slots</span>
        {slotsQuery.isLoading && <span>Loading…</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(slotsQuery.data ?? []).map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isAvailable = slot.status === "available";
          return (
            <button
              key={slot.id}
              onClick={() => isAvailable && setSelectedSlotId(slot.id)}
              className={cn(
                "flex flex-col rounded-2xl border p-3 text-left text-sm transition-all",
                isAvailable ? "bg-card" : "bg-muted text-muted-foreground",
                isSelected && "border-primary bg-primary/10 text-primary"
              )}
              disabled={!isAvailable}
            >
              <span className="font-semibold">{formatSlotLabel(slot.from, slot.to)}</span>
              <span className="text-xs text-muted-foreground">
                {isAvailable ? "Open" : "Unavailable"}
              </span>
              {isSelected && <span className="mt-2 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
        {!slotsQuery.isLoading && (slotsQuery.data ?? []).length === 0 && (
          <p className="col-span-2 rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            Slots open 3 hours before start. Try another day.
          </p>
        )}
      </div>
    </div>
  );

  const renderToggleGroup = (
    options: { id: string; label: string; helper?: string }[],
    value: string | null,
    onChange: (id: string) => void,
    disabled: boolean
  ) => (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          disabled={disabled}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-2xl border px-4 py-3 text-left transition-all",
            value === option.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground/70",
            disabled && "opacity-50"
          )}
        >
          <p className="font-semibold">{option.label}</p>
          {option.helper && <p className="text-xs text-muted-foreground">{option.helper}</p>}
        </button>
      ))}
    </div>
  );

  const renderBookingForm = () => (
    <div className="space-y-3">
      {([
        { label: "Name", field: "name", type: "text", placeholder: "Captain name" },
        { label: "Phone", field: "number", type: "tel", placeholder: "+91" },
        { label: "Email (optional)", field: "email", type: "email", placeholder: "team@email.com" },
        { label: "Alternate Contact", field: "alternateContactName", type: "text", placeholder: "Co-player" },
        { label: "Alternate Number", field: "alternateContactNumber", type: "tel", placeholder: "+91" },
      ] as const).map((input) => (
        <div key={input.field} className="space-y-1">
          <Label htmlFor={input.field}>{input.label}</Label>
          <Input
            id={input.field}
            type={input.type}
            placeholder={input.placeholder}
            value={bookingForm[input.field]}
            onChange={(event) => handleFieldChange(input.field, event.target.value)}
          />
        </div>
      ))}
    </div>
  );

  const renderBookingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        <CalendarDays className="size-5 text-primary" /> Booking
      </div>
      <Card className="space-y-6 p-5">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock4 className="size-4 text-primary" /> Choose a day
          </div>
          {renderDateSelector()}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4 text-primary" /> Time slots
          </div>
          {renderSlots()}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PartyPopper className="size-4 text-primary" /> Purpose
          </div>
          {renderToggleGroup(PURPOSE_OPTIONS, purpose, (value) => setPurpose(value), !canPickExtras)}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-primary" /> Payment
          </div>
          {renderToggleGroup(
            PAYMENT_OPTIONS.map((option) => ({
              id: option.id,
              label: option.label,
              helper: option.id === "advance" ? "Hold slot for 2 hrs" : "Best for confirmed matches",
            })),
            paymentChoice,
            (value) => setPaymentChoice(value as "advance" | "full"),
            !canPickExtras
          )}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PhoneCall className="size-4 text-primary" /> Team details
          </div>
          {renderBookingForm()}
        </section>
        <div className="space-y-2">
          <Button
            className="w-full rounded-full text-base"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            onClick={handlePayNow}
          >
            {isSubmitting ? "Processing…" : "Pay & Lock Slot"}
          </Button>
          {formError && <p className="text-center text-sm text-destructive">{formError}</p>}
          {formSuccess && <p className="text-center text-sm text-primary">{formSuccess}</p>}
          <p className="text-center text-xs text-muted-foreground">
            Pay now to generate a verification code. You can download the ticket instantly.
          </p>
        </div>
      </Card>
    </div>
  );

  const handleFetchBookings = () => {
    if (!viewPhone.trim()) return;
    setLookupNumber(viewPhone.trim());
    void bookingHistoryQuery.refetch();
    void customerLookupQuery.refetch();
  };

  const handleReschedule = (ticket: Ticket) => {
    alert(`Reschedule request recorded for ${ticket.bookingId ?? ticket.id}. Our team will call you.`);
  };

  const renderTicketList = (header: string, data: Ticket[], emptyCopy: string, upcoming = false) => (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <TicketIcon className="size-4 text-primary" />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{header}</p>
      </div>
      <div className="space-y-3">
        {data.map((ticket) => (
          <Card key={ticket.id} className={cn(!upcoming && "opacity-70") }>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{format(parseISO(ticket.date), "EEE, d MMM")}</CardTitle>
                <CardDescription>{formatSlotLabel(ticket.from, ticket.to)}</CardDescription>
              </div>
              <Badge variant={upcoming ? "default" : "secondary"}>{ticket.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{ticket.name}</p>
              <p>{ticket.phone}</p>
              <p>Paid ₹{ticket.amountPaid} · {ticket.paymentMode === "full" ? "Full" : "Advance"}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => setActiveTicket(ticket)}>
                View Ticket
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => downloadTicketAsPdf(ticket)}
              >
                <Download className="mr-2 size-4" /> PDF
              </Button>
              {upcoming && (
                <Button
                  className="flex-1"
                  variant="ghost"
                  onClick={() => handleReschedule(ticket)}
                >
                  <RefreshCcw className="mr-2 size-4" /> Reschedule
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {!data.length && (
          <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            {emptyCopy}
          </p>
        )}
      </div>
    </section>
  );

  const renderViewTab = () => (
    <div className="space-y-6">
      <Card className="space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="lookupNumber">Find bookings via phone</Label>
          <div className="flex gap-2">
            <Input
              id="lookupNumber"
              placeholder="Enter phone number"
              value={viewPhone}
              onChange={(event) => setViewPhone(event.target.value)}
            />
            <Button onClick={handleFetchBookings} disabled={!viewPhone.trim()}>
              Fetch
            </Button>
          </div>
          {bookingHistoryQuery.isLoading && <p className="text-sm text-muted-foreground">Loading bookings…</p>}
        </div>
      </Card>
      {renderTicketList("Upcoming", upcomingTickets, "No upcoming bookings yet", true)}
      {renderTicketList("Past", pastTickets, "Past bookings will show up after your session")}
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        <Images className="size-4 text-primary" /> Gallery
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GALLERY.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-3xl"
          >
            <div className="relative h-48 w-full">
              <Image src={item.src} alt={item.label} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <PhoneCall className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Talk to humans</h2>
        </div>
        <div className="space-y-2 text-sm">
          {CONTACT_INFO.phones.map((phone) => (
            <div key={phone.value} className="flex flex-col">
              <span className="text-muted-foreground">{phone.label}</span>
              <a href={`tel:${phone.value.replace(/\s/g, "")}`} className="text-lg font-semibold">
                {phone.value}
              </a>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <a href={`mailto:${CONTACT_INFO.email}`} className="text-lg font-semibold">
            {CONTACT_INFO.email}
          </a>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Hours</p>
          <p className="text-lg font-semibold">{CONTACT_INFO.hours}</p>
        </div>
        <div className="flex gap-3">
          <Button className="flex-1" asChild>
            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={CONTACT_INFO.mapsLink} target="_blank" rel="noreferrer">
              Open Maps
            </a>
          </Button>
        </div>
      </Card>
      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <div>
            <p className="text-lg font-semibold">House rules</p>
            <p className="text-sm text-muted-foreground">
              Only non-marking shoes · Arrive 10 mins early · Last-minute rain checks get credits.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabContent: Record<TabKey, ReactNode> = {
    home: (
      <div className="space-y-6">
        {renderHero()}
        {renderLocation()}
        {renderInstructions()}
        {renderHighlights()}
      </div>
    ),
    book: renderBookingTab(),
    view: renderViewTab(),
    gallery: renderGalleryTab(),
    contact: renderContactTab(),
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted pb-28">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Pitch Perfect</p>
            <p className="text-lg font-semibold">Turf Booking</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-muted/70 p-1 text-xs font-semibold shadow-inner">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setLanguage(option.id)}
                  className={cn(
                    "rounded-full px-3 py-1 transition",
                    language === option.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-6 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed inset-x-0 bottom-3 z-50 mx-auto w-full max-w-md px-4">
        <div className="flex items-center justify-between rounded-3xl border bg-card/95 p-2 shadow-lg backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("size-5", isActive && "text-primary")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <TicketModal
        ticket={activeTicket}
        onClose={() => setActiveTicket(null)}
        onDownloadImage={downloadTicketAsImage}
        onDownloadPdf={downloadTicketAsPdf}
      />
    </div>
  );
}

type TicketModalProps = {
  ticket: Ticket | null;
  onClose: () => void;
  onDownloadImage: (ticket: Ticket) => void;
  onDownloadPdf: (ticket: Ticket) => void;
};

function TicketModal({ ticket, onClose, onDownloadImage, onDownloadPdf }: TicketModalProps) {
  return (
    <AnimatePresence>
      {ticket && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="w-full max-w-md rounded-3xl bg-card p-5 text-sm shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Booking Confirmed</p>
                <h3 className="text-2xl font-semibold">Verification {ticket.verificationCode}</h3>
                <p className="text-muted-foreground">Show this code at the turf gate.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                ✕
              </Button>
            </div>
            <div className="mt-4 space-y-2 rounded-2xl bg-accent/30 p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <p className="font-semibold">{format(parseISO(ticket.date), "EEE, d MMM yyyy")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock4 className="size-4 text-primary" />
                <p>{formatSlotLabel(ticket.from, ticket.to)}</p>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="size-4 text-primary" />
                <p>{ticket.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <p>Paid ₹{ticket.amountPaid} · {ticket.paymentMode === "full" ? "Full" : "Advance"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={() => onDownloadImage(ticket)} className="w-full">
                <Images className="mr-2 size-4" /> Download as image
              </Button>
              <Button variant="outline" onClick={() => onDownloadPdf(ticket)} className="w-full">
                <Download className="mr-2 size-4" /> Download PDF
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
