import { TRPCError } from "@trpc/server";
import { eq, asc, inArray } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { banners, managers } from "~/server/db/schema";
import { CloudinaryService } from "~/server/cloudinary";

const managerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const manager = await db.query.managers.findFirst({
        where: eq(managers.authId, ctx.session.user.id),
    });

    if (!manager) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Manager access required" });
    }

    return next({
        ctx: {
            ...ctx,
            manager,
        },
    });
});

export const bannerRouter = createTRPCRouter({
    // Get all active banners (public)
    getAll: publicProcedure.query(async () => {
        const items = await db.query.banners.findMany({
            where: eq(banners.status, "active"),
            orderBy: [asc(banners.displayOrder)],
            with: {
                manager: {
                    columns: {
                        id: true,
                    },
                },
            },
        });

        return items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            altText: item.altText,
            mediaType: item.mediaType,
            cloudinaryUrl: item.cloudinaryUrl,
            displayOrder: item.displayOrder,
        }));
    }),

    // Get all banner items (admin - including all statuses)
    getAllAdmin: managerProcedure.query(async () => {
        const items = await db.query.banners.findMany({
            orderBy: [asc(banners.displayOrder)],
            with: {
                manager: {
                    columns: {
                        id: true,
                    },
                },
            },
        });

        return items.map((item) => ({
            ...item,
            isActive: item.status === "active",
        }));
    }),

    // Get single banner item
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
        const item = await db.query.banners.findFirst({
            where: eq(banners.id, input.id),
        });

        if (!item) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Banner item not found" });
        }

        return {
            ...item,
            isActive: item.status === "active",
        };
    }),

    // Create banner item
    create: managerProcedure
        .input(
            z.object({
                title: z.string().max(200).optional(),
                description: z.string().optional(),
                altText: z.string().max(256).optional(),
                mediaType: z.enum(["image", "video", "gif"]),
                cloudinaryPublicId: z.string(),
                cloudinaryUrl: z.string().url(),
                displayOrder: z.number().int().min(0).default(0),
                status: z.enum(["active", "inactive", "draft"]).default("active"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newItem = await db
                .insert(banners)
                .values({
                    title: input.title,
                    description: input.description,
                    altText: input.altText,
                    mediaType: input.mediaType,
                    cloudinaryPublicId: input.cloudinaryPublicId,
                    cloudinaryUrl: input.cloudinaryUrl,
                    displayOrder: input.displayOrder,
                    status: input.status,
                    uploadedBy: ctx.manager.id,
                })
                .returning();

            return newItem[0];
        }),

    // Update banner item
    update: managerProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string().max(200).optional(),
                description: z.string().optional(),
                altText: z.string().max(256).optional(),
                displayOrder: z.number().int().min(0).optional(),
                status: z.enum(["active", "inactive", "draft"]).optional(),
            })
        )
        .mutation(async ({ input }) => {
            const updateData: Record<string, unknown> = {
                updatedAt: new Date(),
            };

            if (input.title !== undefined) updateData.title = input.title;
            if (input.description !== undefined) updateData.description = input.description;
            if (input.altText !== undefined) updateData.altText = input.altText;
            if (input.displayOrder !== undefined) updateData.displayOrder = input.displayOrder;
            if (input.status !== undefined) updateData.status = input.status;

            const updated = await db
                .update(banners)
                .set(updateData)
                .where(eq(banners.id, input.id))
                .returning();

            if (!updated.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Banner item not found" });
            }

            return updated[0];
        }),

    // Delete banner item
    delete: managerProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const item = await db.query.banners.findFirst({
                where: eq(banners.id, input.id),
            });

            if (!item) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Banner item not found" });
            }

            // Delete from Cloudinary
            try {
                // Map banner mediaType to Cloudinary resource type
                // gif is treated as image in Cloudinary
                const cloudinaryType = item.mediaType === "video" ? "video" : "image";
                await CloudinaryService.deleteResource(item.cloudinaryPublicId, cloudinaryType);
            } catch (error) {
                console.error("Error deleting from Cloudinary:", error);
                // Continue with database deletion even if Cloudinary deletion fails
            }

            // Delete from database
            await db.delete(banners).where(eq(banners.id, input.id));

            return { success: true };
        }),

    // Reorder banner items
    reorder: managerProcedure
        .input(
            z.object({
                items: z.array(
                    z.object({
                        id: z.number(),
                        displayOrder: z.number().int().min(0),
                    })
                ),
            })
        )
        .mutation(async ({ input }) => {
            await Promise.all(
                input.items.map((item) =>
                    db
                        .update(banners)
                        .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
                        .where(eq(banners.id, item.id))
                )
            );

            return { success: true };
        }),

    // Bulk toggle active status
    toggleActive: managerProcedure
        .input(
            z.object({
                ids: z.array(z.number()),
                isActive: z.boolean(),
            })
        )
        .mutation(async ({ input }) => {
            const newStatus = input.isActive ? "active" : "inactive";
            await db
                .update(banners)
                .set({ status: newStatus as "active" | "inactive" | "draft", updatedAt: new Date() })
                .where(inArray(banners.id, input.ids));

            return { success: true };
        }),
});
