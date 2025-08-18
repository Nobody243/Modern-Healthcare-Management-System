-- ============================================
-- DROP OBSOLETE TRIGGER
-- Purpose: Remove the cascade trigger that is no longer needed
--          after database normalization to 3NF
-- ============================================

-- The HIS_PATIENT_NAME_CASCADE_TRG trigger is now obsolete because:
-- 1. We dropped all the redundant columns (LAB_PAT_NAME, PRES_PAT_NAME, etc.)
-- 2. We created views with JOINs that automatically show updated names
-- 3. The trigger tries to update columns that no longer exist

DROP TRIGGER HIS_PATIENT_NAME_CASCADE_TRG;

COMMIT;

-- Verify the trigger is dropped
SELECT TRIGGER_NAME, STATUS FROM USER_TRIGGERS WHERE TRIGGER_NAME = 'HIS_PATIENT_NAME_CASCADE_TRG';
-- Should return no rows if successfully dropped
