-- AlterTable: add whatsapp_notifications to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp_notifications" BOOLEAN DEFAULT true;
