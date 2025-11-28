// Lightweight .env loader (avoids adding `dotenv` dependency so `pnpm dlx tsx` works)
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const envFile = join(process.cwd(), ".env");
if (existsSync(envFile)) {
    try {
        const envRaw = readFileSync(envFile, "utf8");
        for (const line of envRaw.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIndex = trimmed.indexOf("=");
            if (eqIndex === -1) continue;
            const key = trimmed.slice(0, eqIndex).trim();
            let val = trimmed.slice(eqIndex + 1).trim();
            if (val.startsWith("\"") && val.endsWith("\"")) {
                val = val.slice(1, -1);
            }
            if (!(key in process.env)) process.env[key] = val;
        }
    } catch {
        // ignore read errors; we'll handle missing DATABASE_URL later
    }
}
import { eq } from "drizzle-orm";

// Note: we delay importing `db` until after we verify `DATABASE_URL` so the env validator
// gives a clear message or we can exit with our own helpful instructions.

void (async () => {
    try {
        console.log("Starting seeder...");

        if (!process.env.DATABASE_URL) {
            console.error(
                "Missing DATABASE_URL. Create a .env file or export DATABASE_URL before running the seeder. Example:"
            );
            console.error(
                "export DATABASE_URL=\"postgres://user:pass@localhost:5432/yourdb\" && pnpm db:seed"
            );
            process.exit(1);
        }

        const { db } = await import("~/server/db");
        const { user, managers, banners } = await import("~/server/db/schema");

        // Create an auth user record that managers.authId can reference
        const userId = "seeder-superadmin";
        const userEmail = "seeder@local";

        // Insert user if not exists
        const existingUser = await db.select().from(user).where(eq(user.id, userId));
        if (existingUser.length === 0) {
            console.log("Inserting auth user...");
            await db.insert(user).values({
                id: userId,
                name: "Seeder SuperAdmin",
                email: userEmail,
                emailVerified: false,
            });
        } else {
            console.log("Auth user already exists, skipping user insert.");
        }

        // Create manager with superAdmin role (idempotent)
        console.log("Ensuring manager (superAdmin) exists...");
        const existingManager = await db
            .select()
            .from(managers)
            .where(eq(managers.authId, userId));

        let managerId: number;
        if (existingManager.length > 0) {
            managerId = (existingManager[0] as { id: number }).id;
            console.log("Manager already exists with id:", managerId);
        } else {
            const insertedManager = await db
                .insert(managers)
                .values({ authId: userId, role: "superAdmin" })
                .returning();

            const managerRow = insertedManager[0];
            managerId = (() => {
                if (managerRow && typeof managerRow === "object" && "id" in managerRow) {
                    return (managerRow as { id: number }).id;
                }
                return Number(managerRow);
            })();
            console.log("Manager created with id:", managerId);
        }

        // Create 4 banner images referencing the manager
        console.log("Creating 4 banner records...");

        const bannerRows = Array.from({ length: 4 }).map((_, i) => ({
                title: `Seeder Banner ${i + 1}`,
                description: `Banner ${i + 1} created by seeder`,
                altText: `Seeder Banner ${i + 1}`,
                type: "image",
                // Using online placeholder images (picsum) so banners work without local assets
                url: `https://picsum.photos/seed/pitchbanner${i + 1}/1200/600`,
                bannerType: "image" as const,
                language: "en" as const,
                bannerIndex: i,
                uploadedBy: managerId,
            }));

        const insertedBanners = await db.insert(banners).values(bannerRows).returning();
        console.log(`Inserted ${insertedBanners.length} banners`);

        console.log("Seeder finished.");
    } catch (err) {
        console.error("Seeder error:", err);
        process.exit(1);
    }
})();
