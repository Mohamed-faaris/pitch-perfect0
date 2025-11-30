import "dotenv/config";
import "../src/env.js";

import { eq } from "drizzle-orm";

import { auth } from "~/server/better-auth";
import { db } from "~/server/db";
import { managers, user } from "~/server/db/schema";

const SUPER_ADMIN_EMAIL = "faaris@dev.com";
const SUPER_ADMIN_NAME = "Faaris";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? "Faaris@dev.com";

async function seedSuperAdmin() {
    const existingUser = await db.query.user.findFirst({
        where: eq(user.email, SUPER_ADMIN_EMAIL),
    });

    const authUser = existingUser
        ? { id: existingUser.id, name: existingUser.name }
        : await createAuthUser();

    if (!authUser) {
        throw new Error("Failed to create Better Auth user");
    }

    const existingManager = await db.query.managers.findFirst({
        where: eq(managers.authId, authUser.id),
    });

    if (!existingManager) {
        await db.insert(managers).values({ authId: authUser.id, role: "superAdmin" });
        console.log("Created manager record for", SUPER_ADMIN_EMAIL);
    } else if (existingManager.role !== "superAdmin") {
        await db.update(managers).set({ role: "superAdmin" }).where(eq(managers.id, existingManager.id));
        console.log("Updated manager role to superAdmin for", SUPER_ADMIN_EMAIL);
    } else {
        console.log("Manager already superAdmin for", SUPER_ADMIN_EMAIL);
    }

    console.log("Super admin ready:", {
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
    });
}

async function createAuthUser() {
    const response = await auth.api.signUpEmail({
        body: {
            email: SUPER_ADMIN_EMAIL,
            password: SUPER_ADMIN_PASSWORD,
            name: SUPER_ADMIN_NAME,
        },
    });

    return response.user;
}

seedSuperAdmin()
    .then(() => {
        console.log("Super admin seeding complete");
    })
    .catch((error) => {
        console.error("Failed to seed super admin", error);
        process.exitCode = 1;
    });
