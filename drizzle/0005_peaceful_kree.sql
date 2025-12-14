ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "flatDiscountAmount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "maxFlatDiscountAmount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "showCoupon" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "minimumBookingAmount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "firstNBookingsOnly" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "nthPurchaseOnly" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "createdBy" integer;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD COLUMN "updatedBy" integer;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_time_slot" ADD COLUMN "fullAmount" integer DEFAULT 80000 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_time_slot" ADD COLUMN "advanceAmount" integer DEFAULT 10000 NOT NULL;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD CONSTRAINT "Aruppukottai_turf_coupon_createdBy_Aruppukottai_turf_manager_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."Aruppukottai_turf_manager"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" ADD CONSTRAINT "Aruppukottai_turf_coupon_updatedBy_Aruppukottai_turf_manager_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."Aruppukottai_turf_manager"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" DROP COLUMN "discountPercentage";--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" DROP COLUMN "maxDiscountAmount";--> statement-breakpoint
ALTER TABLE "Aruppukottai_turf_coupon" DROP COLUMN "minimumPurchaseAmount";