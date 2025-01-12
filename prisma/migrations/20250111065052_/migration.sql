-- CreateEnum
CREATE TYPE "CITIZENSHIP" AS ENUM ('WNI', 'WNA');

-- CreateTable
CREATE TABLE "user_account" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "dob" TIMESTAMPTZ(3) NOT NULL,
    "citizenship" "CITIZENSHIP" NOT NULL DEFAULT 'WNI',
    "country" VARCHAR(255) NOT NULL DEFAULT 'Indonesia',
    "images" BYTEA,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_username_key" ON "user_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_number_key" ON "customer"("phone_number");

-- CreateIndex
CREATE INDEX "customer_fullname_email_idx" ON "customer"("fullname", "email");

-- CreateIndex
CREATE INDEX "customer_created_at_idx" ON "customer"("created_at");

-- CreateIndex
CREATE INDEX "customer_citizenship_idx" ON "customer"("citizenship");
