import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { bookings, timeSlots } from "~/server/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

// Generate 4-digit verification code
function generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const bookingRouter = createTRPCRouter({
    // Create a single booking
    create: publicProcedure
        .input(
            z.object({
                number: z.string().min(1, "Phone number is required"),
                timeSlotId: z.number(),
                bookingType: z.enum(["cricket", "football"]),
                paymentType: z.enum(["full", "advance"]),
            })
        )
        .mutation(async ({ input }) => {
            // Check if time slot is available
            const slot = await db
                .select()
                .from(timeSlots)
                .where(
                    and(
                        eq(timeSlots.id, input.timeSlotId),
                        eq(timeSlots.status, "available")
                    )
                );

            if (!slot[0]) {
                throw new Error("Time slot is not available");
            }

            // Determine amounts based on payment type
            const totalAmount = 80000; // ₹800 in paise
            const amountPaid = input.paymentType === "full" ? 80000 : 10000;
            const status: "advancePaid" | "fullPaid" = input.paymentType === "full" ? "fullPaid" : "advancePaid";

            // Generate verification code
            const verificationCode = generateVerificationCode();

            // Create booking
            const result = await db
                .insert(bookings)
                .values({
                    phoneNumber: input.number,
                    timeSlotId: input.timeSlotId,
                    totalAmount,
                    amountPaid,
                    status,
                    bookingType: input.bookingType,
                    verificationCode,
                })
                .returning();

            // Update time slot to booked
            await db
                .update(timeSlots)
                .set({ status: "booked" })
                .where(eq(timeSlots.id, input.timeSlotId));

            // Return booking with slot details
            return {
                ...result[0],
                from: slot[0].from,
                to: slot[0].to,
                date: slot[0].date,
            };
        }),

    // Book slots using phone number and time slot IDs (legacy)
    book: publicProcedure
        .input(
            z.object({
                number: z.string().min(1, "Phone number is required"),
                timeSlotIds: z.array(z.number()).min(1, "At least one time slot is required"),
                paymentType: z.enum(["full", "advance"], {
                    required_error: "Payment type is required",
                }),
            })
        )
        .mutation(async ({ input }) => {

            // Check if all time slots are available
            const slots = await db
                .select()
                .from(timeSlots)
                .where(
                    and(
                        inArray(timeSlots.id, input.timeSlotIds),
                        eq(timeSlots.status, "available")
                    )
                );

            if (slots.length !== input.timeSlotIds.length) {
                throw new Error("Some time slots are not available");
            }

            // Determine amounts based on payment type
            const totalAmount = 80000; // ₹800 in paise
            const amountPaid = input.paymentType === "full" ? 80000 : 10000; // Full: ₹800, Advance: ₹100
            const status: "advancePaid" | "fullPaid" = input.paymentType === "full" ? "fullPaid" : "advancePaid";

            // Create bookings
            const bookingInserts = input.timeSlotIds.map(timeSlotId => ({
                phoneNumber: input.number,
                timeSlotId,
                totalAmount,
                amountPaid,
                status,
                verificationCode: generateVerificationCode(),
                bookingType: "cricket" as const,
            }));

            const result = await db
                .insert(bookings)
                .values(bookingInserts)
                .returning();

            // Update time slots to booked
            await db
                .update(timeSlots)
                .set({ status: "booked" })
                .where(inArray(timeSlots.id, input.timeSlotIds));

            return result;
        }),

    // Get bookings by phone number
    getByNumber: publicProcedure
        .input(
            z.object({
                number: z.string().min(1, "Phone number is required"),
            })
        )
        .query(async ({ input }) => {
            const result = await db
                .select({
                    id: bookings.id,
                    phoneNumber: bookings.phoneNumber,
                    timeSlotId: bookings.timeSlotId,
                    status: bookings.status,
                    amountPaid: bookings.amountPaid,
                    totalAmount: bookings.totalAmount,
                    verificationCode: bookings.verificationCode,
                    bookingType: bookings.bookingType,
                    createdAt: bookings.createdAt,
                    updatedAt: bookings.updatedAt,
                    timeSlot: {
                        from: timeSlots.from,
                        to: timeSlots.to,
                        date: timeSlots.date,
                        status: timeSlots.status,
                    },
                })
                .from(bookings)
                .leftJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
                .where(eq(bookings.phoneNumber, input.number))
                .orderBy(desc(bookings.createdAt));

            return result;
        }),
});