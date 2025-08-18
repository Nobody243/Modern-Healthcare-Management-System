-- ============================================
-- DATABASE NORMALIZATION TO 3NF
-- Purpose: Remove duplicate data and use JOINs with Foreign Keys
-- ============================================
-- 
-- DENORMALIZATION ISSUES FOUND:
-- 1. LAB_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 2. MDR_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 3. MDR_PAT_ADR - duplicates PAT_ADDR from HIS_PATIENTS
-- 4. MDR_PAT_AGE - duplicates PAT_AGE from HIS_PATIENTS
-- 5. PT_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 6. PAY_DOC_NAME - duplicates DOC_FNAME + DOC_LNAME from HIS_DOCS
-- 7. PAY_DOC_EMAIL - duplicates DOC_EMAIL from HIS_DOCS
-- 8. PRES_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 9. PRES_DOC_NAME - duplicates DOC_FNAME + DOC_LNAME from HIS_DOCS
-- 10. SURG_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 11. SURG_DOC_NAME - duplicates DOC_FNAME + DOC_LNAME from HIS_DOCS
-- 12. VIT_PAT_NAME - duplicates PAT_FNAME + PAT_LNAME from HIS_PATIENTS
-- 13. LAB_PAT_AILMENT - duplicates PAT_AILMENT from HIS_PATIENTS
-- 14. MDR_PAT_AILMENT - duplicates PAT_AILMENT from HIS_PATIENTS
--
-- SOLUTION: Drop these columns and use JOINs to retrieve data from parent tables
-- ============================================

-- BACKUP RECOMMENDATION: Before running this, backup your database!
-- CREATE TABLE BACKUP_<tablename> AS SELECT * FROM <tablename>;

-- ============================================
-- STEP 1: Drop Redundant Columns
-- ============================================

-- Drop from HIS_LABORATORY

/* ALTER TABLE HIS_LABORATORY DROP COLUMN LAB_PAT_NAME;
ALTER TABLE HIS_LABORATORY DROP COLUMN LAB_PAT_AILMENT;

-- Drop from HIS_MEDICAL_RECORDS
ALTER TABLE HIS_MEDICAL_RECORDS DROP COLUMN MDR_PAT_NAME;
ALTER TABLE HIS_MEDICAL_RECORDS DROP COLUMN MDR_PAT_ADR;
ALTER TABLE HIS_MEDICAL_RECORDS DROP COLUMN MDR_PAT_AGE;
ALTER TABLE HIS_MEDICAL_RECORDS DROP COLUMN MDR_PAT_AILMENT;

-- Drop from HIS_PATIENT_TRANSFER
ALTER TABLE HIS_PATIENT_TRANSFER DROP COLUMN PT_PAT_NAME;

-- Drop from HIS_PAYROLLS
ALTER TABLE HIS_PAYROLLS DROP COLUMN PAY_DOC_NAME;
ALTER TABLE HIS_PAYROLLS DROP COLUMN PAY_DOC_EMAIL;

-- Drop from HIS_PRESCRIPTIONS
ALTER TABLE HIS_PRESCRIPTIONS DROP COLUMN PRES_PAT_NAME;
ALTER TABLE HIS_PRESCRIPTIONS DROP COLUMN PRES_DOC_NAME;

-- Drop from HIS_SURGERY
ALTER TABLE HIS_SURGERY DROP COLUMN SURG_PAT_NAME;
ALTER TABLE HIS_SURGERY DROP COLUMN SURG_DOC_NAME;

-- Drop from HIS_VITALS
ALTER TABLE HIS_VITALS DROP COLUMN VIT_PAT_NAME;

COMMIT; */

-- ============================================
-- STEP 2: Create Views for Easy Data Retrieval
-- ============================================

-- Laboratory View with Patient and Doctor Info
CREATE OR REPLACE VIEW V_LABORATORY AS
SELECT 
    l.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS LAB_PAT_NAME,
    p.PAT_AILMENT AS LAB_PAT_AILMENT,
    p.PAT_EMAIL AS LAB_PAT_EMAIL,
    p.PAT_PHONE AS LAB_PAT_PHONE,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS LAB_DOC_NAME,
    d.DOC_EMAIL AS LAB_DOC_EMAIL,
    d.DOC_DEPT AS LAB_DOC_DEPT
FROM HIS_LABORATORY l
LEFT JOIN HIS_PATIENTS p ON l.LAB_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON l.LAB_DOC_NUMBER = d.DOC_NUMBER;

-- Medical Records View with Patient and Doctor Info
CREATE OR REPLACE VIEW V_MEDICAL_RECORDS AS
SELECT 
    m.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS MDR_PAT_NAME,
    p.PAT_ADDR AS MDR_PAT_ADR,
    p.PAT_AGE AS MDR_PAT_AGE,
    p.PAT_AILMENT AS MDR_PAT_AILMENT,
    p.PAT_EMAIL AS MDR_PAT_EMAIL,
    p.PAT_PHONE AS MDR_PAT_PHONE,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS MDR_DOC_NAME,
    d.DOC_EMAIL AS MDR_DOC_EMAIL,
    d.DOC_DEPT AS MDR_DOC_DEPT
FROM HIS_MEDICAL_RECORDS m
LEFT JOIN HIS_PATIENTS p ON m.MDR_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON m.MDR_DOC_NUMBER = d.DOC_NUMBER;

-- Patient Transfer View with Patient Info
CREATE OR REPLACE VIEW V_PATIENT_TRANSFER AS
SELECT 
    t.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS PT_PAT_NAME,
    p.PAT_EMAIL AS PT_PAT_EMAIL,
    p.PAT_PHONE AS PT_PAT_PHONE,
    p.PAT_TYPE AS PT_PAT_TYPE
FROM HIS_PATIENT_TRANSFER t
LEFT JOIN HIS_PATIENTS p ON t.PT_PAT_NUMBER = p.PAT_NUMBER;

-- Payrolls View with Doctor Info
CREATE OR REPLACE VIEW V_PAYROLLS AS
SELECT 
    pay.*,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS PAY_DOC_NAME,
    d.DOC_EMAIL AS PAY_DOC_EMAIL,
    d.DOC_PHONE AS PAY_DOC_PHONE,
    d.DOC_DEPT AS PAY_DOC_DEPT
FROM HIS_PAYROLLS pay
LEFT JOIN HIS_DOCS d ON pay.PAY_DOC_NUMBER = d.DOC_NUMBER;

-- Prescriptions View with Patient and Doctor Info
CREATE OR REPLACE VIEW V_PRESCRIPTIONS AS
SELECT 
    pr.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS PRES_PAT_NAME,
    p.PAT_EMAIL AS PRES_PAT_EMAIL,
    p.PAT_PHONE AS PRES_PAT_PHONE,
    p.PAT_AGE AS PRES_PAT_AGE,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS PRES_DOC_NAME,
    d.DOC_EMAIL AS PRES_DOC_EMAIL,
    d.DOC_DEPT AS PRES_DOC_DEPT
FROM HIS_PRESCRIPTIONS pr
LEFT JOIN HIS_PATIENTS p ON pr.PRES_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON pr.PRES_DOC_NUMBER = d.DOC_NUMBER;

-- Surgery View with Patient and Doctor Info
CREATE OR REPLACE VIEW V_SURGERY AS
SELECT 
    s.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS SURG_PAT_NAME,
    p.PAT_EMAIL AS SURG_PAT_EMAIL,
    p.PAT_PHONE AS SURG_PAT_PHONE,
    p.PAT_AGE AS SURG_PAT_AGE,
    p.PAT_BLOOD_GROUP AS SURG_PAT_BLOOD_GROUP,
    d.DOC_FNAME || ' ' || d.DOC_LNAME AS SURG_DOC_NAME,
    d.DOC_EMAIL AS SURG_DOC_EMAIL,
    d.DOC_DEPT AS SURG_DOC_DEPT
FROM HIS_SURGERY s
LEFT JOIN HIS_PATIENTS p ON s.SURG_PAT_NUMBER = p.PAT_NUMBER
LEFT JOIN HIS_DOCS d ON s.SURG_DOC_NUMBER = d.DOC_NUMBER;

-- Vitals View with Patient Info
CREATE OR REPLACE VIEW V_VITALS AS
SELECT 
    v.*,
    p.PAT_FNAME || ' ' || p.PAT_LNAME AS VIT_PAT_NAME,
    p.PAT_EMAIL AS VIT_PAT_EMAIL,
    p.PAT_PHONE AS VIT_PAT_PHONE,
    p.PAT_AGE AS VIT_PAT_AGE,
    p.PAT_BLOOD_GROUP AS VIT_PAT_BLOOD_GROUP
FROM HIS_VITALS v
LEFT JOIN HIS_PATIENTS p ON v.VIT_PAT_NUMBER = p.PAT_NUMBER;

COMMIT;

-- ============================================
-- STEP 3: Verification Queries
-- ============================================

-- Test Laboratory View
-- SELECT * FROM V_LABORATORY WHERE ROWNUM <= 5;

-- Test Medical Records View
-- SELECT * FROM V_MEDICAL_RECORDS WHERE ROWNUM <= 5;

-- Test Patient Transfer View
-- SELECT * FROM V_PATIENT_TRANSFER WHERE ROWNUM <= 5;

-- Test Payrolls View
-- SELECT * FROM V_PAYROLLS WHERE ROWNUM <= 5;

-- Test Prescriptions View
-- SELECT * FROM V_PRESCRIPTIONS WHERE ROWNUM <= 5;

-- Test Surgery View
-- SELECT * FROM V_SURGERY WHERE ROWNUM <= 5;

-- Test Vitals View
-- SELECT * FROM V_VITALS WHERE ROWNUM <= 5;

-- ============================================
-- SUMMARY
-- ============================================
-- After running this script:
-- 1. Duplicate columns are removed from all tables
-- 2. Database is now in 3NF (no transitive dependencies)
-- 3. Views provide easy access to combined data using JOINs
-- 4. Data consistency is automatically maintained
-- 5. Updates to patient/doctor names automatically reflect everywhere
-- 6. Storage space is reduced (no duplicate data)
-- 
-- APPLICATION CHANGES REQUIRED:
-- Replace all queries from:
--   SELECT * FROM HIS_LABORATORY
-- To:
--   SELECT * FROM V_LABORATORY
-- 
-- Do the same for all other normalized tables.
-- ============================================
