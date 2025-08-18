--------------------------------------------------------
-- CLOB ERROR DIAGNOSTIC & FIX SCRIPT
-- Run this to identify and fix ORA-00932 CLOB errors
--------------------------------------------------------

-- ============================================
-- STEP 1: CHECK FOR CLOB COLUMNS
-- ============================================

SELECT 
    table_name, 
    column_name, 
    data_type,
    data_length
FROM user_tab_columns
WHERE table_name LIKE 'HIS_%'
AND data_type IN ('CLOB', 'BLOB', 'NCLOB')
ORDER BY table_name, column_name;

-- Expected: No CLOB columns should exist
-- If you see CLOB columns, they need to be converted to VARCHAR2

-- ============================================
-- STEP 2: CHECK PRESCRIPTION TABLE STRUCTURE
-- ============================================

SELECT 
    column_name,
    data_type,
    data_length,
    nullable
FROM user_tab_columns
WHERE table_name = 'HIS_PRESCRIPTIONS'
ORDER BY column_id;

-- Expected columns:
-- PRES_ID, PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME
-- PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION
-- PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION
-- PRES_DATE, PRES_STATUS, PRES_REFILLS_REMAINING
-- PRES_NOTES, CREATED_AT, UPDATED_AT

-- ============================================
-- STEP 3: CHECK ALL TABLE COLUMNS FOR TEXT TYPES
-- ============================================

SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'VARCHAR2' THEN 'OK'
        WHEN data_type IN ('CLOB', 'BLOB', 'NCLOB') THEN '⚠️ NEEDS FIX'
        WHEN data_type = 'LONG' THEN '⚠️ NEEDS FIX'
        ELSE 'OK'
    END AS status
FROM user_tab_columns
WHERE table_name LIKE 'HIS_%'
AND data_type IN ('VARCHAR2', 'CLOB', 'BLOB', 'NCLOB', 'LONG', 'CHAR')
ORDER BY table_name, column_name;

-- ============================================
-- STEP 4: FIX CLOB COLUMNS (IF FOUND)
-- ============================================

-- If STEP 1 found CLOB columns, use these templates to fix them:

-- Template to convert CLOB to VARCHAR2:
-- ALTER TABLE table_name MODIFY (column_name VARCHAR2(4000));

-- Example fixes (uncomment if needed):

-- Fix PRES_INS if it's CLOB:
-- ALTER TABLE HIS_PRESCRIPTIONS MODIFY (PRES_INS VARCHAR2(2000));

-- Fix PRES_NOTES if it's CLOB:
-- ALTER TABLE HIS_PRESCRIPTIONS MODIFY (PRES_NOTES VARCHAR2(2000));

-- Fix LAB_PAT_RESULTS if it's CLOB:
-- ALTER TABLE HIS_LABORATORY MODIFY (LAB_PAT_RESULTS VARCHAR2(4000));

-- Fix MDR_DIAGNOSIS if it's CLOB:
-- ALTER TABLE HIS_MEDICAL_RECORDS MODIFY (MDR_DIAGNOSIS VARCHAR2(2000));

-- Fix MDR_TREATMENT_PLAN if it's CLOB:
-- ALTER TABLE HIS_MEDICAL_RECORDS MODIFY (MDR_TREATMENT_PLAN VARCHAR2(2000));

-- Fix SURG_NOTES if it's CLOB:
-- ALTER TABLE HIS_SURGERY MODIFY (SURG_NOTES VARCHAR2(2000));

-- ============================================
-- STEP 5: VERIFY NO CLOB IN GROUP BY
-- ============================================

-- This query checks if any views use CLOB/LONG in aggregations
SELECT 
    view_name,
    text
FROM user_views
WHERE view_name LIKE 'V_%'
ORDER BY view_name;

-- Review the TEXT column for any CLOB references

-- ============================================
-- STEP 6: TEST PRESCRIPTION INSERT
-- ============================================

-- Test if prescription insert works now
SELECT 'Testing prescription structure...' FROM DUAL;

-- Show current prescription count
SELECT COUNT(*) AS Current_Prescription_Count FROM HIS_PRESCRIPTIONS;

-- Try a sample insert (will rollback)
SAVEPOINT before_test;

INSERT INTO HIS_PRESCRIPTIONS (
    PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, 
    PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, 
    PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, 
    PRES_DATE, PRES_STATUS
) VALUES (
    'TEST001', 'PAT001', 'Test Patient', 
    'DOC001', 'Test Doctor', 'Test Medication', 
    '100mg', 'Twice daily', '7 days', 
    SYSTIMESTAMP, 'Active'
);

SELECT 'Test insert successful!' FROM DUAL;

-- Rollback test
ROLLBACK TO before_test;

SELECT 'Test rolled back. Structure is correct.' FROM DUAL;

-- ============================================
-- STEP 7: COMMON SOLUTIONS
-- ============================================

/*
COMMON CAUSES OF ORA-00932 CLOB ERROR:

1. CLOB columns in GROUP BY clause
   Solution: Convert CLOB to VARCHAR2(4000) or exclude from GROUP BY

2. CLOB columns in DISTINCT or UNION
   Solution: Use TO_CHAR(clob_column) or convert to VARCHAR2

3. CLOB columns in ORDER BY
   Solution: Convert to VARCHAR2 or use DBMS_LOB.SUBSTR(clob, 4000)

4. Implicit data type conversion
   Solution: Explicitly cast with TO_CHAR() or TO_CLOB()

5. View joining tables with CLOB
   Solution: Exclude CLOB from view or use subquery

RECOMMENDED ACTION:
Run STEP 1 to identify CLOB columns, then use STEP 4 templates to fix them.
All text columns should be VARCHAR2(max_length) not CLOB.
*/

-- ============================================
-- STEP 8: FINAL VERIFICATION
-- ============================================

SELECT 
    'Tables: ' || COUNT(*) AS database_stats
FROM user_tables
WHERE table_name LIKE 'HIS_%'
UNION ALL
SELECT 
    'Sequences: ' || COUNT(*)
FROM user_sequences
WHERE sequence_name LIKE 'HIS_%'
UNION ALL
SELECT 
    'Views: ' || COUNT(*)
FROM user_views
WHERE view_name LIKE 'V_%'
UNION ALL
SELECT 
    'CLOB Columns: ' || COUNT(*)
FROM user_tab_columns
WHERE table_name LIKE 'HIS_%'
AND data_type = 'CLOB';

SELECT 'Diagnostic complete!' FROM DUAL;
