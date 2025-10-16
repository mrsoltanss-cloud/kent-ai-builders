-- Baseline to match current DB (idempotent; safe to run multiple times)

-- Ensure updatedAt exists with default
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='User' AND column_name='updatedAt'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Ensure reference exists on Lead
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='Lead' AND column_name='reference'
  ) THEN
    ALTER TABLE "Lead" ADD COLUMN "reference" TEXT;
  END IF;
END $$;

-- Ensure unique index on reference
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'Lead_reference_key'
  ) THEN
    CREATE UNIQUE INDEX "Lead_reference_key" ON "Lead"("reference");
  END IF;
END $$;
