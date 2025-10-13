DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'LeadStatus' AND e.enumlabel = 'NEW'
  ) THEN
    ALTER TYPE "LeadStatus" ADD VALUE 'NEW';
  END IF;
END $$;
