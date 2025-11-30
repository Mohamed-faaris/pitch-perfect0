import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { timeSlots } from "~/server/db/schema";
import { eq, and, gte } from "drizzle-orm";

export const timeSlotRouter = createTRPCRouter({
    // 1. Get all available slots across all dates (current and forward)
    // Returns up to `limit` slots ordered by date and time
    getAllAvailable: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(24 * 31).default(24 * 5),
            })
        )
        .query(async ({ input }) => {
            const today = new Date().toISOString().split("T")[0]!; // YYYY-MM-DD format

            const result = await db
                .select()
                .from(timeSlots)
                .where(
                    and(
                        eq(timeSlots.status, "available"),
                        gte(timeSlots.date, today) // current date and forward
                    )
                )
                .orderBy(timeSlots.date, timeSlots.from)
                .limit(input.limit);

            return result;
        }),

    // 2. Get all slots for a specific date (current and forward times only)
    // Returns slots grouped by date with only future/current times
    getAllByDate: publicProcedure
        .input(
            z.object({
                date: z.string().default(() => new Date().toISOString().split("T")[0]!), // Default to today (YYYY-MM-DD format)
            })
        )
        .query(async ({ input }) => {
            const now = new Date();
            const today = now.toISOString().split("T")[0]!;
            const currentTime = now.toTimeString().split(" ")[0]!; // HH:MM:SS format

            let query = db
                .select()
                .from(timeSlots)
                .where(
                    eq(timeSlots.date, input.date)
                )
                .$dynamic();

            // If the requested date is today, only return slots with times >= current time
            if (input.date === today) {
                query = query.where(gte(timeSlots.from, currentTime));
            }

            const result = await query.orderBy(timeSlots.from);

            return result;
        }),

    // 3. Get slots by date (alias for getAllByDate)
    getByDate: publicProcedure
        .input(
            z.object({
                date: z.string(), // YYYY-MM-DD format
            })
        )
        .query(async ({ input }) => {
            const now = new Date();
            const today = now.toISOString().split("T")[0]!;
            const currentTime = now.toTimeString().split(" ")[0]!; // HH:MM:SS format

            let query = db
                .select()
                .from(timeSlots)
                .where(
                    eq(timeSlots.date, input.date)
                )
                .$dynamic();

            // If the requested date is today, only return slots with times >= current time
            if (input.date === today) {
                query = query.where(gte(timeSlots.from, currentTime));
            }

            const result = await query.orderBy(timeSlots.from);

            return result;
        }),

});
