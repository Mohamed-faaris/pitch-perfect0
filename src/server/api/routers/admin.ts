import { TRPCError } from "@trpc/server";
import { count, desc, eq, sum } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
    bookings,
    configTable,
    coupons,
    customers,
    managers,
    timeSlots,
    user,
} from "~/server/db/schema";

const managerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const manager = await db.query.managers.findFirst({
        where: eq(managers.authId, ctx.session.user.id),
    });

    if (!manager || manager.role === "staff") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Manager access required" });
    }

    return next({
        ctx: {
            ...ctx,
            manager,
        },
    });
});

const superAdminProcedure = managerProcedure.use(({ ctx, next }) => {
    if (ctx.manager.role !== "superAdmin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Super admin only" });
    }

    return next();
});

export const adminRouter = createTRPCRouter({
    bookingsList: managerProcedure
        .input(
            z.object({
                limit: z.number().int().min(1).max(50).default(20),
            }),
        )
        .query(async ({ input }) => {
            return db
                .select({
                    id: bookings.id,
                    phoneNumber: bookings.phoneNumber,
                    amountPaid: bookings.amountPaid,
                    status: bookings.status,
                    verificationCode: bookings.verificationCode,
                    createdAt: bookings.createdAt,
                    slot: {
                        from: timeSlots.from,
                        to: timeSlots.to,
                        date: timeSlots.date,
                    },
                })
                .from(bookings)
                .leftJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
                .orderBy(desc(bookings.createdAt))
                .limit(input.limit);
        }),

    verifyBooking: managerProcedure
        .input(z.object({ bookingId: z.string().uuid() }))
        .mutation(async ({ input }) => {
            const [updated] = await db
                .update(bookings)
                .set({ status: "fullPaid" })
                .where(eq(bookings.id, input.bookingId))
                .returning({ id: bookings.id, status: bookings.status });

            if (!updated) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
            }

            return updated;
        }),

    couponsList: managerProcedure.query(async () => {
        return db
            .select({
                id: coupons.id,
                code: coupons.code,
                description: coupons.description,
                usageLimit: coupons.usageLimit,
                numberOfUses: coupons.numberOfUses,
                validFrom: coupons.validFrom,
                validTo: coupons.validTo,
            })
            .from(coupons)
            .orderBy(desc(coupons.createdAt));
    }),

    staffList: managerProcedure.query(async () => {
        return db
            .select({
                id: managers.id,
                role: managers.role,
                createdAt: managers.createdAt,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            })
            .from(managers)
            .innerJoin(user, eq(user.id, managers.authId));
    }),

    customersList: managerProcedure
        .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
        .query(async ({ input }) => {
            const limit = input?.limit ?? 50;
            return db
                .select({
                    id: customers.id,
                    name: customers.name,
                    email: customers.email,
                    number: customers.number,
                    languagePreference: customers.languagePreference,
                    createdAt: customers.createdAt,
                })
                .from(customers)
                .orderBy(desc(customers.createdAt))
                .limit(limit);
        }),

    configGet: managerProcedure.query(async () => {
        const record = await db.query.configTable.findFirst();
        return record ?? null;
    }),

    configUpdate: managerProcedure
        .input(
            z.object({
                fullPaymentMode: z.boolean().optional(),
                maintenanceMode: z.boolean().optional(),
                maintenanceMessage: z.string().max(200).optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const existing = await db.query.configTable.findFirst();

            if (!existing) {
                const [created] = await db
                    .insert(configTable)
                    .values({
                        updatedBy: ctx.manager.id,
                        fullPaymentMode: input.fullPaymentMode ?? false,
                        maintenanceMode: input.maintenanceMode ?? false,
                        maintenanceMessage: input.maintenanceMessage ?? "",
                    })
                    .returning();
                return created;
            }

            const updatePayload: Partial<typeof configTable.$inferInsert> = {
                updatedBy: ctx.manager.id,
            };

            if (input.fullPaymentMode !== undefined) {
                updatePayload.fullPaymentMode = input.fullPaymentMode;
            }
            if (input.maintenanceMode !== undefined) {
                updatePayload.maintenanceMode = input.maintenanceMode;
            }
            if (input.maintenanceMessage !== undefined) {
                updatePayload.maintenanceMessage = input.maintenanceMessage;
            }

            const [updated] = await db
                .update(configTable)
                .set(updatePayload)
                .where(eq(configTable.id, existing.id))
                .returning();

            return updated;
        }),
});

export const superAdminRouter = createTRPCRouter({
    dashboardSummary: superAdminProcedure.query(async () => {
        const [bookingStats] = await db
            .select({
                totalBookings: count(bookings.id),
                totalRevenue: sum(bookings.amountPaid),
            })
            .from(bookings);

        const [slotStats] = await db
            .select({ availableSlots: count(timeSlots.id) })
            .from(timeSlots)
            .where(eq(timeSlots.status, "available"));

        const recentBookings = await db
            .select({
                id: bookings.id,
                phoneNumber: bookings.phoneNumber,
                amountPaid: bookings.amountPaid,
                status: bookings.status,
                createdAt: bookings.createdAt,
                slotFrom: timeSlots.from,
                slotTo: timeSlots.to,
                slotDate: timeSlots.date,
            })
            .from(bookings)
            .leftJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
            .orderBy(desc(bookings.createdAt))
            .limit(10);

        return {
            totals: {
                totalBookings: bookingStats?.totalBookings ?? 0,
                totalRevenue: bookingStats?.totalRevenue ?? 0,
                availableSlots: slotStats?.availableSlots ?? 0,
            },
            recentBookings,
        } as const;
    }),

    adminsList: superAdminProcedure.query(async () => {
        return db
            .select({
                id: managers.id,
                role: managers.role,
                createdAt: managers.createdAt,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            })
            .from(managers)
            .innerJoin(user, eq(user.id, managers.authId))
            .where(eq(managers.role, "admin"));
    }),
});
