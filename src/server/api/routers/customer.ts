import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const customerRouter = createTRPCRouter({
    // Create a new customer
    create: publicProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required").max(100),
                number: z.string().min(1, "Phone number is required").max(20),
                email: z.string().email("Invalid email"),
                alternateContactName: z.string().min(1).max(100),
                alternateContactNumber: z.string().min(1).max(20),
                languagePreference: z.enum(["en", "ta"]).default("en"),
            })
        )
        .mutation(async ({ input }) => {
            const result = await db
                .insert(customers)
                .values({
                    name: input.name,
                    number: input.number,
                    email: input.email,
                    alternateContactName: input.alternateContactName,
                    alternateContactNumber: input.alternateContactNumber,
                    languagePreference: input.languagePreference,
                })
                .returning();

            return result[0];
        }),

    // Get customer by phone number
    getByPhoneNumber: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string().min(1, "Phone number is required"),
            })
        )
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(customers)
                .where(eq(customers.number, input.phoneNumber));

            return result[0] ?? null;
        }),

    // Get customer by ID
    getById: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(customers)
                .where(eq(customers.id, input.id));

            return result[0] ?? null;
        }),

    // Update customer
    update: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string().min(1, "Phone number is required"),
                name: z.string().min(1).max(100).optional(),
                email: z.string().email().optional(),
                alternateContactName: z.string().min(1).max(100).optional(),
                alternateContactNumber: z.string().min(1).max(20).optional(),
                languagePreference: z.enum(["en", "ta"]).optional(),
            })
        )
        .mutation(async ({ input }) => {
            const { phoneNumber, ...updateData } = input;

            const result = await db
                .update(customers)
                .set(updateData)
                .where(eq(customers.number, phoneNumber))
                .returning();

            return result[0] ?? null;
        }),

    // List all customers (paginated)
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(customers)
                .limit(input.limit)
                .offset(input.offset);

            return result;
        }),

    // Delete customer
    delete: publicProcedure
        .input(
            z.object({
                phoneNumber: z.string().min(1, "Phone number is required"),
            })
        )
        .mutation(async ({ input }) => {
            const result = await db
                .delete(customers)
                .where(eq(customers.number, input.phoneNumber))
                .returning();

            return result[0] ?? null;
        }),
});