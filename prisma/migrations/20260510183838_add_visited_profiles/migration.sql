-- CreateTable
CREATE TABLE "visited_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "visited_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visited_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visited_profiles_user_id_idx" ON "visited_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "visited_profiles_user_id_visited_user_id_key" ON "visited_profiles"("user_id", "visited_user_id");

-- AddForeignKey
ALTER TABLE "visited_profiles" ADD CONSTRAINT "visited_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_profiles" ADD CONSTRAINT "visited_profiles_visited_user_id_fkey" FOREIGN KEY ("visited_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
