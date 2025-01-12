-- DropIndex
DROP INDEX "customer_created_at_idx";

-- DropIndex
DROP INDEX "customer_fullname_email_idx";

-- CreateIndex
CREATE INDEX "customer_fullname_idx" ON "customer"("fullname" ASC);

-- CreateIndex
CREATE INDEX "customer_email_idx" ON "customer"("email" ASC);

-- CreateIndex
CREATE INDEX "customer_created_at_idx" ON "customer"("created_at" DESC);

-- CreateIndex
CREATE INDEX "customer_citizenship_created_at_idx" ON "customer"("citizenship" ASC, "created_at" DESC);
