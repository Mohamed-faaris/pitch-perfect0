ALTER TABLE "Aruppukottai_turf_config" ADD COLUMN "slots" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_config" DROP COLUMN "slotIntervalMinutes";--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_config" DROP COLUMN "numberOfSlotsPerDay";--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_config" DROP COLUMN "slotsVisibleDaysInAdvance";