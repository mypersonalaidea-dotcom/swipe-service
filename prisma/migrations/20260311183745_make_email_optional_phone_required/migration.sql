-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "age" INTEGER,
    "gender" VARCHAR(20),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "profile_picture_url" TEXT,
    "search_type" VARCHAR(20) DEFAULT 'both',
    "phone_verified" BOOLEAN DEFAULT false,
    "email_verified" BOOLEAN DEFAULT false,
    "is_published" BOOLEAN DEFAULT false,
    "last_login_at" TIMESTAMPTZ,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_degrees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255) NOT NULL,
    "common_name" VARCHAR(100) NOT NULL,
    "other_names" TEXT[],
    "submitted_by" UUID,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_degrees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255) NOT NULL,
    "common_name" VARCHAR(100) NOT NULL,
    "other_names" TEXT[],
    "submitted_by" UUID,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "aliases" TEXT[],
    "logo_url" TEXT,
    "website" TEXT,
    "submitted_by" UUID,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_institutions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "aliases" TEXT[],
    "logo_url" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "submitted_by" UUID,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_habits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" VARCHAR(50) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "icon_name" VARCHAR(50),
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_amenities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "amenity_type" VARCHAR(20) NOT NULL,
    "icon_name" VARCHAR(50),
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_job_experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_id" UUID,
    "position_id" UUID,
    "company_name" VARCHAR(255),
    "position_name" VARCHAR(255),
    "from_year" VARCHAR(4),
    "till_year" VARCHAR(4),
    "currently_working" BOOLEAN DEFAULT false,
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_job_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_education_experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "institution_id" UUID,
    "degree_id" UUID,
    "institution_name" VARCHAR(255),
    "degree_name" VARCHAR(255),
    "start_year" VARCHAR(4),
    "end_year" VARCHAR(4),
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_education_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_habits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "habit_id" UUID NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_looking_for_habits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "habit_id" UUID NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_looking_for_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "furnishing_type" VARCHAR(30),
    "description" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flat_id" UUID NOT NULL,
    "room_type" VARCHAR(20) NOT NULL,
    "rent" DECIMAL(10,2),
    "security_deposit" DECIMAL(10,2),
    "brokerage" DECIMAL(10,2),
    "available_count" INTEGER DEFAULT 1,
    "available_from" DATE,
    "furnishing_type" VARCHAR(30),
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_amenities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_common_amenities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flat_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flat_common_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flat_id" UUID NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" VARCHAR(10) DEFAULT 'image',
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flat_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" VARCHAR(10) DEFAULT 'image',
    "display_order" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "initiated_by" UUID NOT NULL,
    "last_message_at" TIMESTAMPTZ,
    "last_message_preview" TEXT,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "unread_count" INTEGER DEFAULT 0,
    "muted" BOOLEAN DEFAULT false,
    "last_read_at" TIMESTAMPTZ,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT,
    "message_type" VARCHAR(20) DEFAULT 'text',
    "media_url" TEXT,
    "reply_to_id" UUID,
    "delivery_status" VARCHAR(20) DEFAULT 'sent',
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "saved_user_id" UUID NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_swipes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "swiped_user_id" UUID NOT NULL,
    "direction" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_swipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reporter_id" UUID NOT NULL,
    "reported_user_id" UUID NOT NULL,
    "reason" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "context" VARCHAR(20),
    "resolved_at" TIMESTAMPTZ,
    "resolved_by" UUID,
    "resolution" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'pending',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blocker_id" UUID NOT NULL,
    "blocked_user_id" UUID NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_search_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "flat_filter_enabled" BOOLEAN DEFAULT true,
    "location_search" TEXT,
    "location_range_km" INTEGER DEFAULT 5,
    "price_min" DECIMAL(10,2) DEFAULT 0,
    "price_max" DECIMAL(10,2) DEFAULT 100000,
    "flat_types" TEXT[],
    "furnishing_types" TEXT[],
    "room_types" TEXT[],
    "available_from" DATE,
    "brokerage_pref" VARCHAR(20),
    "security_deposit_max" DECIMAL(10,2),
    "flatmate_filter_enabled" BOOLEAN DEFAULT true,
    "flatmate_age_min" INTEGER DEFAULT 18,
    "flatmate_age_max" INTEGER DEFAULT 60,
    "flatmate_move_in_date" DATE,
    "profile_filter_enabled" BOOLEAN DEFAULT false,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_search_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_filter_habits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "habit_id" UUID NOT NULL,
    "filter_context" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_filter_habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_filter_amenities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,
    "amenity_context" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_filter_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_filter_companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_filter_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_filter_institutions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_filter_institutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_city_idx" ON "users"("city");

-- CreateIndex
CREATE INDEX "users_search_type_idx" ON "users"("search_type");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_is_published_idx" ON "users"("is_published");

-- CreateIndex
CREATE UNIQUE INDEX "master_degrees_common_name_key" ON "master_degrees"("common_name");

-- CreateIndex
CREATE UNIQUE INDEX "master_positions_common_name_key" ON "master_positions"("common_name");

-- CreateIndex
CREATE UNIQUE INDEX "master_habits_label_key" ON "master_habits"("label");

-- CreateIndex
CREATE UNIQUE INDEX "master_amenities_name_key" ON "master_amenities"("name");

-- CreateIndex
CREATE INDEX "user_job_experiences_user_id_idx" ON "user_job_experiences"("user_id");

-- CreateIndex
CREATE INDEX "user_job_experiences_company_id_idx" ON "user_job_experiences"("company_id");

-- CreateIndex
CREATE INDEX "user_job_experiences_position_id_idx" ON "user_job_experiences"("position_id");

-- CreateIndex
CREATE INDEX "user_education_experiences_user_id_idx" ON "user_education_experiences"("user_id");

-- CreateIndex
CREATE INDEX "user_education_experiences_institution_id_idx" ON "user_education_experiences"("institution_id");

-- CreateIndex
CREATE INDEX "user_education_experiences_degree_id_idx" ON "user_education_experiences"("degree_id");

-- CreateIndex
CREATE INDEX "user_habits_user_id_idx" ON "user_habits"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_habits_user_id_habit_id_key" ON "user_habits"("user_id", "habit_id");

-- CreateIndex
CREATE INDEX "user_looking_for_habits_user_id_idx" ON "user_looking_for_habits"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_looking_for_habits_user_id_habit_id_key" ON "user_looking_for_habits"("user_id", "habit_id");

-- CreateIndex
CREATE INDEX "flats_user_id_idx" ON "flats"("user_id");

-- CreateIndex
CREATE INDEX "flats_city_idx" ON "flats"("city");

-- CreateIndex
CREATE INDEX "flats_status_idx" ON "flats"("status");

-- CreateIndex
CREATE INDEX "rooms_flat_id_idx" ON "rooms"("flat_id");

-- CreateIndex
CREATE INDEX "rooms_room_type_idx" ON "rooms"("room_type");

-- CreateIndex
CREATE INDEX "rooms_rent_idx" ON "rooms"("rent");

-- CreateIndex
CREATE UNIQUE INDEX "room_amenities_room_id_amenity_id_key" ON "room_amenities"("room_id", "amenity_id");

-- CreateIndex
CREATE UNIQUE INDEX "flat_common_amenities_flat_id_amenity_id_key" ON "flat_common_amenities"("flat_id", "amenity_id");

-- CreateIndex
CREATE INDEX "conversations_last_message_at_idx" ON "conversations"("last_message_at" DESC);

-- CreateIndex
CREATE INDEX "conversation_participants_user_id_idx" ON "conversation_participants"("user_id");

-- CreateIndex
CREATE INDEX "conversation_participants_conversation_id_idx" ON "conversation_participants"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_conversation_id_user_id_key" ON "conversation_participants"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "messages_delivery_status_idx" ON "messages"("delivery_status");

-- CreateIndex
CREATE INDEX "saved_profiles_user_id_idx" ON "saved_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_profiles_user_id_saved_user_id_key" ON "saved_profiles"("user_id", "saved_user_id");

-- CreateIndex
CREATE INDEX "profile_swipes_user_id_idx" ON "profile_swipes"("user_id");

-- CreateIndex
CREATE INDEX "profile_swipes_swiped_user_id_idx" ON "profile_swipes"("swiped_user_id");

-- CreateIndex
CREATE INDEX "profile_swipes_direction_idx" ON "profile_swipes"("direction");

-- CreateIndex
CREATE INDEX "profile_swipes_created_at_idx" ON "profile_swipes"("created_at");

-- CreateIndex
CREATE INDEX "user_reports_reporter_id_idx" ON "user_reports"("reporter_id");

-- CreateIndex
CREATE INDEX "user_reports_reported_user_id_idx" ON "user_reports"("reported_user_id");

-- CreateIndex
CREATE INDEX "user_reports_status_idx" ON "user_reports"("status");

-- CreateIndex
CREATE INDEX "user_blocks_blocker_id_idx" ON "user_blocks"("blocker_id");

-- CreateIndex
CREATE INDEX "user_blocks_blocked_user_id_idx" ON "user_blocks"("blocked_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blocker_id_blocked_user_id_key" ON "user_blocks"("blocker_id", "blocked_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_search_preferences_user_id_key" ON "user_search_preferences"("user_id");

-- CreateIndex
CREATE INDEX "user_search_preferences_user_id_idx" ON "user_search_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_filter_habits_user_id_habit_id_filter_context_key" ON "user_filter_habits"("user_id", "habit_id", "filter_context");

-- CreateIndex
CREATE UNIQUE INDEX "user_filter_amenities_user_id_amenity_id_amenity_context_key" ON "user_filter_amenities"("user_id", "amenity_id", "amenity_context");

-- CreateIndex
CREATE UNIQUE INDEX "user_filter_companies_user_id_company_id_key" ON "user_filter_companies"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_filter_institutions_user_id_institution_id_key" ON "user_filter_institutions"("user_id", "institution_id");

-- AddForeignKey
ALTER TABLE "master_degrees" ADD CONSTRAINT "master_degrees_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_positions" ADD CONSTRAINT "master_positions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_companies" ADD CONSTRAINT "master_companies_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_institutions" ADD CONSTRAINT "master_institutions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_job_experiences" ADD CONSTRAINT "user_job_experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_job_experiences" ADD CONSTRAINT "user_job_experiences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "master_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_job_experiences" ADD CONSTRAINT "user_job_experiences_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "master_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_education_experiences" ADD CONSTRAINT "user_education_experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_education_experiences" ADD CONSTRAINT "user_education_experiences_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "master_institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_education_experiences" ADD CONSTRAINT "user_education_experiences_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "master_degrees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_habits" ADD CONSTRAINT "user_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_habits" ADD CONSTRAINT "user_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "master_habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_looking_for_habits" ADD CONSTRAINT "user_looking_for_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_looking_for_habits" ADD CONSTRAINT "user_looking_for_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "master_habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_amenities" ADD CONSTRAINT "room_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "master_amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_common_amenities" ADD CONSTRAINT "flat_common_amenities_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_common_amenities" ADD CONSTRAINT "flat_common_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "master_amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_media" ADD CONSTRAINT "flat_media_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_media" ADD CONSTRAINT "room_media_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_initiated_by_fkey" FOREIGN KEY ("initiated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_profiles" ADD CONSTRAINT "saved_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_profiles" ADD CONSTRAINT "saved_profiles_saved_user_id_fkey" FOREIGN KEY ("saved_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_swipes" ADD CONSTRAINT "profile_swipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_swipes" ADD CONSTRAINT "profile_swipes_swiped_user_id_fkey" FOREIGN KEY ("swiped_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_search_preferences" ADD CONSTRAINT "user_search_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_habits" ADD CONSTRAINT "user_filter_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_habits" ADD CONSTRAINT "user_filter_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "master_habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_amenities" ADD CONSTRAINT "user_filter_amenities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_amenities" ADD CONSTRAINT "user_filter_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "master_amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_companies" ADD CONSTRAINT "user_filter_companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_companies" ADD CONSTRAINT "user_filter_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "master_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_institutions" ADD CONSTRAINT "user_filter_institutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filter_institutions" ADD CONSTRAINT "user_filter_institutions_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "master_institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
