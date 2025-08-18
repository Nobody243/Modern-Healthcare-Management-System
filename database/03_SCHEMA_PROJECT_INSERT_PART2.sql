--------------------------------------------------------
-- HOSPITAL MANAGEMENT SYSTEM (HMS)
-- Data Insertion Script Part 2 - Oracle SQL Developer
-- Database: SCHEMA_PROJECT
-- 
-- Contents:
-- - 10 Accounts
-- - 12 Assets
-- - 15 Equipments
-- - 15 Laboratory tests
-- - 15 Medical records
-- - 12 Patient transfers
-- - 10 Payrolls
-- - 20 Prescriptions
-- - 15 Surgeries
-- - 20 Vitals
-- - User accounts with roles
--------------------------------------------------------

-- Set date format
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

-- ============================================
-- SECTION 1: ACCOUNTS (10 RECORDS)
-- ============================================

INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Hospital Operating Account', 'Main operating account for daily expenses', 'Asset Account', 'ACC001', 2500000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Patient Receivables', 'Outstanding patient payments', 'Receivable Account', 'ACC002', 450000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Medical Supplies Payable', 'Amounts owed to suppliers', 'Payable Account', 'ACC003', 180000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Equipment Investment', 'Capital invested in medical equipment', 'Asset Account', 'ACC004', 1200000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Employee Payroll Account', 'Staff salary payments', 'Liability Account', 'ACC005', 320000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Insurance Receivables', 'Claims pending from insurance companies', 'Receivable Account', 'ACC006', 575000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Pharmaceutical Inventory', 'Value of medicines in stock', 'Asset Account', 'ACC007', 390000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Building Maintenance Fund', 'Reserved for facility maintenance', 'Asset Account', 'ACC008', 125000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Research & Development', 'Medical research initiatives', 'Equity Account', 'ACC009', 200000.00, 'USD');
INSERT INTO HIS_ACCOUNTS (ACC_NAME, ACC_DESC, ACC_TYPE, ACC_NUMBER, ACC_AMOUNT, ACC_CURRENCY) VALUES
('Emergency Reserve Fund', 'Emergency financial reserves', 'Asset Account', 'ACC010', 500000.00, 'USD');

-- ============================================
-- SECTION 2: ASSETS (12 RECORDS)
-- ============================================

INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('MRI Scanner 3T', 'High-field MRI scanner for advanced imaging', 'RadiologyPro Equipment', 'Active', 'Radiology', TO_DATE('2023-01-15', 'YYYY-MM-DD'), 2500000.00, 'MRI-3T-001');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('CT Scanner 64-Slice', '64-slice computed tomography scanner', 'RadiologyPro Equipment', 'Active', 'Radiology', TO_DATE('2022-06-20', 'YYYY-MM-DD'), 1800000.00, 'CT-64-002');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Ultrasound Machine', 'Portable ultrasound system', 'HealthTech Solutions', 'Active', 'Obstetrics', TO_DATE('2023-03-10', 'YYYY-MM-DD'), 85000.00, 'USG-PORT-003');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Surgical Robot System', 'Da Vinci surgical robot', 'Surgical Equipment Inc', 'Active', 'Surgery', TO_DATE('2021-09-05', 'YYYY-MM-DD'), 1500000.00, 'ROBOT-DV-004');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Patient Monitors (10 units)', 'Bedside patient monitoring systems', 'CardioMed Devices', 'Active', 'ICU', TO_DATE('2023-02-14', 'YYYY-MM-DD'), 120000.00, 'MON-ICU-005');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Ventilators (5 units)', 'ICU mechanical ventilators', 'Emergency Medical Supply', 'Active', 'ICU', TO_DATE('2022-11-30', 'YYYY-MM-DD'), 175000.00, 'VENT-ICU-006');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('X-Ray Machine', 'Digital radiography system', 'RadiologyPro Equipment', 'Maintenance', 'Radiology', TO_DATE('2020-04-12', 'YYYY-MM-DD'), 250000.00, 'XRAY-DIG-007');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Laboratory Analyzer', 'Automated chemistry analyzer', 'BioLab Diagnostics', 'Active', 'Laboratory', TO_DATE('2023-05-20', 'YYYY-MM-DD'), 195000.00, 'LAB-CHEM-008');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Defibrillators (8 units)', 'Automated external defibrillators', 'CardioMed Devices', 'Active', 'Emergency Medicine', TO_DATE('2023-01-08', 'YYYY-MM-DD'), 64000.00, 'DEFIB-AED-009');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Anesthesia Machines (3 units)', 'Operating room anesthesia workstations', 'Surgical Equipment Inc', 'Active', 'Surgery', TO_DATE('2022-08-15', 'YYYY-MM-DD'), 210000.00, 'ANES-OR-010');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('EEG System', 'Electroencephalography diagnostic system', 'NeuroCare Technologies', 'Active', 'Neurology', TO_DATE('2023-04-22', 'YYYY-MM-DD'), 75000.00, 'EEG-NEURO-011');
INSERT INTO HIS_ASSETS (ASST_NAME, ASST_DESC, ASST_VENDOR, ASST_STATUS, ASST_DEPT, ASST_PURCHASE_DATE, ASST_PURCHASE_COST, ASST_SERIAL_NUMBER) VALUES
('Autoclave Sterilizers (4 units)', 'Medical equipment sterilization systems', 'Sterilization Systems Ltd', 'Active', 'Central Sterile', TO_DATE('2022-12-10', 'YYYY-MM-DD'), 92000.00, 'STER-AUTO-012');

-- ============================================
-- SECTION 3: EQUIPMENTS (15 RECORDS)
-- ============================================

INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP001', 'Stethoscopes', 'MediSupply Corp', 'Professional stethoscopes for clinical examination', 'General', 'Functioning', 50, 'Supply Room A');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP002', 'Blood Pressure Monitors', 'CardioMed Devices', 'Digital BP monitors', 'Cardiology', 'Functioning', 30, 'Cardiology Ward');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP003', 'Surgical Scissors', 'Surgical Equipment Inc', 'Sterile surgical scissors various sizes', 'Surgery', 'Functioning', 200, 'OR Storage');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP004', 'IV Stands', 'Hospital Furniture Co', 'Adjustable intravenous drip stands', 'General', 'Functioning', 80, 'Equipment Storage');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP005', 'Wheelchairs', 'Hospital Furniture Co', 'Manual wheelchairs for patient transport', 'General', 'Functioning', 25, 'Main Lobby');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP006', 'Pulse Oximeters', 'HealthTech Solutions', 'Fingertip pulse oximeters', 'Emergency Medicine', 'Functioning', 40, 'ER Supply');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP007', 'Nebulizers', 'PharmaCare International', 'Respiratory therapy nebulizers', 'Pulmonology', 'Functioning', 20, 'Respiratory Therapy');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP008', 'Glucometers', 'BioLab Diagnostics', 'Blood glucose monitors with strips', 'Endocrinology', 'Functioning', 35, 'Diabetes Clinic');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP009', 'ECG Machines', 'CardioMed Devices', '12-lead electrocardiogram machines', 'Cardiology', 'Functioning', 8, 'Cardiology Lab');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP010', 'Otoscopes', 'MediSupply Corp', 'Ear examination otoscopes', 'ENT', 'Functioning', 15, 'ENT Clinic');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP011', 'Thermometers', 'HealthTech Solutions', 'Digital infrared thermometers', 'General', 'Functioning', 100, 'Nursing Stations');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP012', 'Surgical Lights', 'Surgical Equipment Inc', 'Operating room surgical lights', 'Surgery', 'Functioning', 6, 'Operating Rooms');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP013', 'Patient Beds', 'Hospital Furniture Co', 'Electric adjustable hospital beds', 'General', 'Functioning', 150, 'Patient Wards');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP014', 'Crash Carts', 'Emergency Medical Supply', 'Emergency resuscitation carts', 'Emergency Medicine', 'Functioning', 12, 'Emergency & ICU');
INSERT INTO HIS_EQUIPMENTS (EQP_CODE, EQP_NAME, EQP_VENDOR, EQP_DESC, EQP_DEPT, EQP_STATUS, EQP_QTY, EQP_LOCATION) VALUES
('EQP015', 'Infant Warmers', 'PediMed Supplies', 'Neonatal warming systems', 'Pediatrics', 'Functioning', 10, 'NICU');

-- ============================================
-- SECTION 4: LABORATORY TESTS (15 RECORDS)
-- ============================================

INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Robert Thompson', 'Hypertension', 'PAT001', 'DOC001', 'Lipid Panel, Complete Metabolic Panel', 'Total Cholesterol: 220 mg/dL, LDL: 145 mg/dL, HDL: 45 mg/dL, Triglycerides: 180 mg/dL', 'LAB001', 'Completed', SYSTIMESTAMP - 5, SYSTIMESTAMP - 4);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Maria Garcia', 'Coronary Artery Disease', 'PAT002', 'DOC001', 'Cardiac Enzyme Panel, Troponin-I', 'Troponin-I: 0.8 ng/mL (elevated), CK-MB: 15 U/L', 'LAB002', 'Completed', SYSTIMESTAMP - 3, SYSTIMESTAMP - 2);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC) VALUES
('William Davis', 'Childhood Asthma', 'PAT003', 'DOC003', 'Pulmonary Function Test, Allergen Panel', NULL, 'LAB003', 'Pending', SYSTIMESTAMP - 1);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Linda Wilson', 'Migraine', 'PAT004', 'DOC002', 'MRI Brain, Complete Blood Count', 'MRI: No abnormalities detected. CBC: Within normal limits', 'LAB004', 'Completed', SYSTIMESTAMP - 7, SYSTIMESTAMP - 6);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Christopher Moore', 'Severe Headache', 'PAT005', 'DOC002', 'CT Brain, ESR, CRP', 'CT: Normal. ESR: 12 mm/hr, CRP: 0.5 mg/dL', 'LAB005', 'Completed', SYSTIMESTAMP - 4, SYSTIMESTAMP - 3);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Daniel Miller', 'Type 2 Diabetes', 'PAT007', 'DOC005', 'HbA1c, Fasting Blood Glucose, Lipid Panel', 'HbA1c: 8.2%, FBG: 165 mg/dL, Total Chol: 195 mg/dL', 'LAB006', 'Completed', SYSTIMESTAMP - 10, SYSTIMESTAMP - 9);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Thomas Anderson', 'Chest Pain', 'PAT009', 'DOC006', 'ECG, Cardiac Markers, D-dimer', 'ECG: ST elevation noted. Troponin: Positive. D-dimer: Normal', 'LAB007', 'Completed', SYSTIMESTAMP - 2, SYSTIMESTAMP - 1);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC) VALUES
('Nancy Martinez', 'Breast Cancer', 'PAT010', 'DOC007', 'Tumor Markers, Complete Metabolic Panel', NULL, 'LAB008', 'In Progress', SYSTIMESTAMP - 1);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Kevin White', 'Chronic Bronchitis', 'PAT011', 'DOC008', 'Chest X-Ray, Sputum Culture', 'CXR: Chronic bronchial thickening. Culture: Normal flora', 'LAB009', 'Completed', SYSTIMESTAMP - 8, SYSTIMESTAMP - 6);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Michelle Clark', 'Type 1 Diabetes', 'PAT014', 'DOC003', 'HbA1c, C-Peptide, Autoantibodies', 'HbA1c: 7.5%, C-Peptide: Low, GAD Ab: Positive', 'LAB010', 'Completed', SYSTIMESTAMP - 12, SYSTIMESTAMP - 11);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Elizabeth Walker', 'Pneumonia', 'PAT016', 'DOC008', 'Chest X-Ray, Blood Culture, CBC', 'CXR: Right lower lobe infiltrate. Culture: Pending. WBC: 15,000', 'LAB011', 'Completed', SYSTIMESTAMP - 3, SYSTIMESTAMP - 2);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Richard Hall', 'Hypothyroidism', 'PAT017', 'DOC005', 'TSH, Free T4, Anti-TPO', 'TSH: 8.5 mIU/L (high), Free T4: 0.7 ng/dL (low), Anti-TPO: Positive', 'LAB012', 'Completed', SYSTIMESTAMP - 6, SYSTIMESTAMP - 5);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Joseph King', 'Prostate Cancer', 'PAT019', 'DOC007', 'PSA, Prostate Biopsy', 'PSA: 12.5 ng/mL. Biopsy: Adenocarcinoma Grade Group 2', 'LAB013', 'Completed', SYSTIMESTAMP - 15, SYSTIMESTAMP - 13);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE) VALUES
('Brian Harris', 'Congestive Heart Failure', 'PAT013', 'DOC001', 'BNP, Echocardiogram, Chest X-Ray', 'BNP: 850 pg/mL (elevated). Echo: EF 35%. CXR: Cardiomegaly', 'LAB014', 'Completed', SYSTIMESTAMP - 5, SYSTIMESTAMP - 4);
INSERT INTO HIS_LABORATORY (LAB_PAT_NAME, LAB_PAT_AILMENT, LAB_PAT_NUMBER, LAB_DOC_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, LAB_NUMBER, LAB_STATUS, LAB_DATE_REC) VALUES
('Betty Wright', 'Parkinsons Disease', 'PAT020', 'DOC002', 'MRI Brain, Dopamine Transporter Scan', NULL, 'LAB015', 'Pending', SYSTIMESTAMP);

-- ============================================
-- SECTION 5: MEDICAL RECORDS (15 RECORDS)
-- ============================================

INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR001', 'Robert Thompson', '123 Oak Street, Springfield', 39, 'Hypertension', 'PAT001', 'DOC001', 'Atorvastatin 20mg daily, Lisinopril 10mg daily', 'Essential Hypertension with Dyslipidemia', 'Lifestyle modification, regular BP monitoring, medication compliance', SYSTIMESTAMP - 30);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR002', 'Maria Garcia', '456 Maple Avenue, Chicago', 32, 'Coronary Artery Disease', 'PAT002', 'DOC001', 'Aspirin 81mg, Atorvastatin 40mg, Metoprolol 50mg', 'Acute Coronary Syndrome - NSTEMI', 'Cardiac catheterization, intensive monitoring, cardiac rehabilitation', SYSTIMESTAMP - 15);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR003', 'William Davis', '789 Pine Road, Naperville', 8, 'Childhood Asthma', 'PAT003', 'DOC003', 'Albuterol inhaler PRN, Fluticasone daily', 'Mild Persistent Asthma', 'Avoid triggers, peak flow monitoring, asthma action plan', SYSTIMESTAMP - 45);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR004', 'Linda Wilson', '321 Elm Street, Peoria', 46, 'Migraine', 'PAT004', 'DOC002', 'Sumatriptan 50mg PRN, Propranolol 40mg daily', 'Chronic Migraine without Aura', 'Identify triggers, stress management, preventive therapy', SYSTIMESTAMP - 60);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR005', 'Daniel Miller', '258 Walnut St, Joliet', 36, 'Type 2 Diabetes', 'PAT007', 'DOC005', 'Metformin 850mg BID, Glipizide 5mg daily', 'Type 2 Diabetes Mellitus - Uncontrolled', 'Diabetic diet, exercise 30min daily, glucose monitoring', SYSTIMESTAMP - 90);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR006', 'Thomas Anderson', '741 Ash Boulevard, Schaumburg', 49, 'Chest Pain', 'PAT009', 'DOC006', 'Aspirin, Heparin, Nitroglycerine', 'ST-Elevation Myocardial Infarction (STEMI)', 'Emergency PCI, CCU admission, cardiac monitoring', SYSTIMESTAMP - 2);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR007', 'Nancy Martinez', '852 Hickory Ln, Skokie', 54, 'Breast Cancer', 'PAT010', 'DOC007', 'Chemotherapy protocol - AC-T regimen', 'Invasive Ductal Carcinoma Stage IIA', 'Neoadjuvant chemotherapy, surgical consultation, radiation', SYSTIMESTAMP - 20);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR008', 'Kevin White', '963 Poplar Rd, Oak Park', 42, 'Chronic Bronchitis', 'PAT011', 'DOC008', 'Albuterol nebulizer, Prednisone taper', 'Chronic Obstructive Pulmonary Disease - Moderate', 'Smoking cessation, pulmonary rehabilitation, bronchodilators', SYSTIMESTAMP - 35);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR009', 'Sarah Jackson', '159 Willow Way, Bolingbrook', 29, 'Major Depression', 'PAT012', 'DOC009', 'Sertraline 50mg daily, Cognitive Behavioral Therapy', 'Major Depressive Disorder - Moderate', 'Psychotherapy weekly, medication adjustment, suicide risk assessment', SYSTIMESTAMP - 25);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR010', 'Michelle Clark', '486 Dogwood Ave, Downers Grove', 12, 'Type 1 Diabetes', 'PAT014', 'DOC003', 'Insulin Glargine 15 units qHS, Lispro with meals', 'Type 1 Diabetes Mellitus - New Onset', 'Diabetes education, insulin titration, continuous glucose monitoring', SYSTIMESTAMP - 40);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR011', 'Patricia Brown', '147 Cedar Ave, Aurora', 59, 'Hip Fracture', 'PAT006', 'DOC004', 'Pain management protocol, DVT prophylaxis', 'Right Femoral Neck Fracture', 'Surgical repair - hip replacement, physical therapy, fall prevention', SYSTIMESTAMP - 10);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR012', 'Elizabeth Walker', '682 Sycamore Pl, Des Plaines', 56, 'Pneumonia', 'PAT016', 'DOC008', 'Azithromycin 500mg daily, oxygen therapy', 'Community-Acquired Pneumonia - Moderate Severity', 'IV antibiotics, respiratory support, chest physiotherapy', SYSTIMESTAMP - 5);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR013', 'Richard Hall', '793 Beech Court, Arlington Heights', 51, 'Hypothyroidism', 'PAT017', 'DOC005', 'Levothyroxine 50mcg daily', 'Primary Hypothyroidism - Autoimmune (Hashimotos)', 'Thyroid function monitoring, dose adjustment, annual checkup', SYSTIMESTAMP - 50);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR014', 'Joseph King', '915 Laurel Drive, Hoffman Estates', 62, 'Prostate Cancer', 'PAT019', 'DOC007', 'Hormone therapy - Leuprolide', 'Adenocarcinoma of Prostate Stage I', 'Active surveillance vs radiation, urologist consultation, PSA monitoring', SYSTIMESTAMP - 18);
INSERT INTO HIS_MEDICAL_RECORDS (MDR_NUMBER, MDR_PAT_NAME, MDR_PAT_ADR, MDR_PAT_AGE, MDR_PAT_AILMENT, MDR_PAT_NUMBER, MDR_DOC_NUMBER, MDR_PAT_PRESCR, MDR_DIAGNOSIS, MDR_TREATMENT_PLAN, MDR_DATE_REC) VALUES
('MDR015', 'Brian Harris', '357 Magnolia St, Wheaton', 66, 'Congestive Heart Failure', 'PAT013', 'DOC001', 'Furosemide 40mg daily, Carvedilol 12.5mg BID, ACE inhibitor', 'Heart Failure with Reduced Ejection Fraction (HFrEF)', 'Fluid restriction, daily weights, cardiac rehabilitation, ICD evaluation', SYSTIMESTAMP - 12);

-- ============================================
-- SECTION 6: PATIENT TRANSFERS (12 RECORDS)
-- ============================================

INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT002', 'Maria Garcia', 'Emergency Department', 'Cardiac ICU', 'NSTEMI - requires intensive cardiac monitoring', SYSTIMESTAMP - 15, 'DOC001', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT005', 'Christopher Moore', 'Emergency Department', 'Neurology Ward', 'Severe headache - neurological observation needed', SYSTIMESTAMP - 4, 'DOC002', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT006', 'Patricia Brown', 'Orthopedic Ward', 'Rehabilitation Unit', 'Post hip replacement - physical therapy', SYSTIMESTAMP - 7, 'DOC004', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT009', 'Thomas Anderson', 'Cardiac ICU', 'Cardiac Care Unit', 'Stable post-PCI, step down from ICU', SYSTIMESTAMP - 1, 'DOC006', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT010', 'Nancy Martinez', 'Oncology Clinic', 'Oncology Ward', 'Chemotherapy administration and monitoring', SYSTIMESTAMP - 20, 'DOC007', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT013', 'Brian Harris', 'Emergency Department', 'Cardiac Ward', 'CHF exacerbation - requires monitoring', SYSTIMESTAMP - 12, 'DOC001', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT016', 'Elizabeth Walker', 'Emergency Department', 'Medical Ward', 'Community-acquired pneumonia', SYSTIMESTAMP - 5, 'DOC008', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT019', 'Joseph King', 'Urology Clinic', 'Oncology Ward', 'Prostate cancer treatment planning', SYSTIMESTAMP - 18, 'DOC007', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT002', 'Maria Garcia', 'Cardiac ICU', 'Cardiac Rehabilitation', 'Post-MI recovery and rehabilitation', SYSTIMESTAMP - 8, 'DOC001', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT006', 'Patricia Brown', 'Rehabilitation Unit', 'Discharge Planning', 'Ready for home discharge with home health', SYSTIMESTAMP - 2, 'DOC004', 'Pending');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT016', 'Elizabeth Walker', 'Medical Ward', 'General Ward', 'Improved condition, stable vitals', SYSTIMESTAMP - 2, 'DOC008', 'Completed');
INSERT INTO HIS_PATIENT_TRANSFER (PT_PAT_NUMBER, PT_PAT_NAME, PT_FROM_WARD, PT_TO_WARD, PT_REASON, PT_TRANSFER_DATE, PT_AUTHORIZED_BY, PT_STATUS) VALUES
('PAT013', 'Brian Harris', 'Cardiac Ward', 'Heart Failure Clinic', 'Chronic management and follow-up', SYSTIMESTAMP - 5, 'DOC001', 'Pending');

-- ============================================
-- SECTION 7: PAYROLLS (10 RECORDS)
-- ============================================

INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY001', 'DOC001', 'Dr. Sarah Johnson', 'sarah.johnson@curewell.com', 18500.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY002', 'DOC002', 'Dr. Michael Chen', 'michael.chen@curewell.com', 19200.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY003', 'DOC003', 'Dr. Emily Rodriguez', 'emily.rodriguez@curewell.com', 16500.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY004', 'DOC004', 'Dr. David Patel', 'david.patel@curewell.com', 21000.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY005', 'DOC005', 'Dr. Jennifer Williams', 'jennifer.williams@curewell.com', 17800.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY006', 'DOC006', 'Dr. Robert Kim', 'robert.kim@curewell.com', 22500.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY007', 'DOC007', 'Dr. Lisa Anderson', 'lisa.anderson@curewell.com', 24000.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY008', 'DOC008', 'Dr. James Martinez', 'james.martinez@curewell.com', 18900.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY009', 'DOC009', 'Dr. Amanda Taylor', 'amanda.taylor@curewell.com', 17500.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');
INSERT INTO HIS_PAYROLLS (PAY_NUMBER, PAY_DOC_NUMBER, PAY_DOC_NAME, PAY_DOC_EMAIL, PAY_AMOUNT, PAY_PERIOD, PAY_STATUS, PAY_DATE, PAY_METHOD) VALUES
('PAY010', 'DOC010', 'Dr. Christopher Lee', 'christopher.lee@curewell.com', 19500.00, 'November 2024', 'Paid', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Direct Deposit');

-- ============================================
-- SECTION 8: PRESCRIPTIONS (20 RECORDS)
-- ============================================

INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES001', 'PAT001', 'Robert Thompson', 'DOC001', 'Dr. Sarah Johnson', 'Atorvastatin', '20mg', 'Once daily', '30 days', SYSTIMESTAMP - 30, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES002', 'PAT001', 'Robert Thompson', 'DOC001', 'Dr. Sarah Johnson', 'Lisinopril', '10mg', 'Once daily', '30 days', SYSTIMESTAMP - 30, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES003', 'PAT002', 'Maria Garcia', 'DOC001', 'Dr. Sarah Johnson', 'Aspirin', '81mg', 'Once daily', '90 days', SYSTIMESTAMP - 15, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES004', 'PAT002', 'Maria Garcia', 'DOC001', 'Dr. Sarah Johnson', 'Atorvastatin', '40mg', 'Once daily at bedtime', '90 days', SYSTIMESTAMP - 15, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES005', 'PAT003', 'William Davis', 'DOC003', 'Dr. Emily Rodriguez', 'Albuterol Inhaler', '90mcg', '2 puffs every 4-6 hours as needed', '30 days', SYSTIMESTAMP - 45, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES006', 'PAT004', 'Linda Wilson', 'DOC002', 'Dr. Michael Chen', 'Sumatriptan', '50mg', 'As needed for migraine', '10 days', SYSTIMESTAMP - 60, 'Completed');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES007', 'PAT007', 'Daniel Miller', 'DOC005', 'Dr. Jennifer Williams', 'Metformin', '850mg', 'Twice daily with meals', '90 days', SYSTIMESTAMP - 90, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES008', 'PAT009', 'Thomas Anderson', 'DOC006', 'Dr. Robert Kim', 'Aspirin', '81mg', 'Once daily', '90 days', SYSTIMESTAMP - 2, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES009', 'PAT011', 'Kevin White', 'DOC008', 'Dr. James Martinez', 'Albuterol Inhaler', '90mcg', '2 puffs four times daily', '30 days', SYSTIMESTAMP - 35, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES010', 'PAT011', 'Kevin White', 'DOC008', 'Dr. James Martinez', 'Prednisone', '10mg', 'Taper: 40-30-20-10mg over 2 weeks', '14 days', SYSTIMESTAMP - 35, 'Completed');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES011', 'PAT012', 'Sarah Jackson', 'DOC009', 'Dr. Amanda Taylor', 'Sertraline', '50mg', 'Once daily in the morning', '90 days', SYSTIMESTAMP - 25, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES012', 'PAT014', 'Michelle Clark', 'DOC003', 'Dr. Emily Rodriguez', 'Insulin Glargine', '15 units', 'Once daily at bedtime', '30 days', SYSTIMESTAMP - 40, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES013', 'PAT016', 'Elizabeth Walker', 'DOC008', 'Dr. James Martinez', 'Azithromycin', '500mg', 'Once daily', '5 days', SYSTIMESTAMP - 5, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES014', 'PAT017', 'Richard Hall', 'DOC005', 'Dr. Jennifer Williams', 'Levothyroxine', '50mcg', 'Once daily on empty stomach', '90 days', SYSTIMESTAMP - 50, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES015', 'PAT018', 'Karen Young', 'DOC009', 'Dr. Amanda Taylor', 'Alprazolam', '0.5mg', 'Twice daily as needed for anxiety', '30 days', SYSTIMESTAMP - 20, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES016', 'PAT013', 'Brian Harris', 'DOC001', 'Dr. Sarah Johnson', 'Furosemide', '40mg', 'Once daily in the morning', '90 days', SYSTIMESTAMP - 12, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES017', 'PAT015', 'Steven Lewis', 'DOC004', 'Dr. David Patel', 'Ibuprofen', '400mg', 'Three times daily with food', '30 days', SYSTIMESTAMP - 25, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES018', 'PAT020', 'Betty Wright', 'DOC002', 'Dr. Michael Chen', 'Carbidopa-Levodopa', '25-100mg', 'Three times daily', '90 days', SYSTIMESTAMP - 15, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES019', 'PAT008', 'Jessica Taylor', 'DOC003', 'Dr. Emily Rodriguez', 'Cetirizine', '10mg', 'Once daily', '30 days', SYSTIMESTAMP - 30, 'Active');
INSERT INTO HIS_PRESCRIPTIONS (PRES_NUMBER, PRES_PAT_NUMBER, PRES_PAT_NAME, PRES_DOC_NUMBER, PRES_DOC_NAME, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, PRES_DURATION, PRES_DATE, PRES_STATUS) VALUES
('PRES020', 'PAT005', 'Christopher Moore', 'DOC002', 'Dr. Michael Chen', 'Ibuprofen', '400mg', 'Every 6 hours as needed', '7 days', SYSTIMESTAMP - 4, 'Active');

-- ============================================
-- SECTION 9: SURGERIES (15 RECORDS)
-- ============================================

INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG001', 'PAT006', 'Patricia Brown', 'DOC004', 'Dr. David Patel', 'Total Hip Replacement', SYSTIMESTAMP - 10, '180 minutes', 'Completed', 'Right hip arthroplasty successful. Patient stable post-op.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG002', 'PAT002', 'Maria Garcia', 'DOC001', 'Dr. Sarah Johnson', 'Percutaneous Coronary Intervention (PCI)', SYSTIMESTAMP - 15, '120 minutes', 'Completed', 'Successful stent placement in LAD. No complications.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG003', 'PAT009', 'Thomas Anderson', 'DOC006', 'Dr. Robert Kim', 'Emergency Cardiac Catheterization', SYSTIMESTAMP - 2, '90 minutes', 'Completed', 'STEMI treated with primary PCI. Door to balloon time 45 minutes.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG004', 'PAT010', 'Nancy Martinez', 'DOC007', 'Dr. Lisa Anderson', 'Lumpectomy with Sentinel Lymph Node Biopsy', SYSTIMESTAMP - 25, '150 minutes', 'Completed', 'Breast-conserving surgery successful. Margins clear. 2 lymph nodes removed.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG005', 'PAT019', 'Joseph King', 'DOC007', 'Dr. Lisa Anderson', 'Prostate Biopsy', SYSTIMESTAMP - 18, '45 minutes', 'Completed', 'Transrectal ultrasound-guided biopsy. 12 core samples obtained.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG006', 'PAT015', 'Steven Lewis', 'DOC004', 'Dr. David Patel', 'Arthroscopic Knee Surgery', SYSTIMESTAMP - 30, '90 minutes', 'Completed', 'Meniscal repair and debridement. Good visualization. Minimal bleeding.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG007', 'PAT005', 'Christopher Moore', 'DOC002', 'Dr. Michael Chen', 'Lumbar Puncture', SYSTIMESTAMP - 4, '30 minutes', 'Completed', 'CSF obtained for analysis. Opening pressure 18 cm H2O. Clear fluid.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG008', 'PAT013', 'Brian Harris', 'DOC001', 'Dr. Sarah Johnson', 'ICD Implantation', SYSTIMESTAMP - 8, '120 minutes', 'Completed', 'Dual chamber ICD placed. Good lead positions. Thresholds acceptable.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG009', 'PAT016', 'Elizabeth Walker', 'DOC008', 'Dr. James Martinez', 'Bronchoscopy', SYSTIMESTAMP - 5, '45 minutes', 'Completed', 'BAL performed. Samples sent for culture. Airways patent.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG010', 'PAT019', 'Joseph King', 'DOC007', 'Dr. Lisa Anderson', 'Radical Prostatectomy', SYSTIMESTAMP + 10, '240 minutes', 'Scheduled', 'Robot-assisted laparoscopic prostatectomy scheduled. Pre-op clearance obtained.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG011', 'PAT010', 'Nancy Martinez', 'DOC007', 'Dr. Lisa Anderson', 'Mastectomy', SYSTIMESTAMP + 15, '180 minutes', 'Scheduled', 'Modified radical mastectomy planned after neoadjuvant chemotherapy.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG012', 'PAT003', 'William Davis', 'DOC003', 'Dr. Emily Rodriguez', 'Tonsillectomy', SYSTIMESTAMP + 5, '60 minutes', 'Scheduled', 'Recurrent tonsillitis. Elective procedure scheduled.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG013', 'PAT014', 'Michelle Clark', 'DOC003', 'Dr. Emily Rodriguez', 'Insulin Pump Placement', SYSTIMESTAMP - 35, '30 minutes', 'Completed', 'Continuous glucose monitor and insulin pump successfully placed and calibrated.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG014', 'PAT020', 'Betty Wright', 'DOC002', 'Dr. Michael Chen', 'Deep Brain Stimulation', SYSTIMESTAMP + 20, '300 minutes', 'Scheduled', 'DBS for advanced Parkinsons disease. Neurosurgery consultation completed.');
INSERT INTO HIS_SURGERY (SURG_NUMBER, SURG_PAT_NUMBER, SURG_PAT_NAME, SURG_DOC_NUMBER, SURG_DOC_NAME, SURG_TYPE, SURG_DATE, SURG_DURATION, SURG_STATUS, SURG_NOTES) VALUES
('SURG015', 'PAT004', 'Linda Wilson', 'DOC002', 'Dr. Michael Chen', 'Occipital Nerve Block', SYSTIMESTAMP - 55, '20 minutes', 'Completed', 'Bilateral occipital nerve blocks for migraine management. Well tolerated.');

-- ============================================
-- SECTION 10: VITALS (20 RECORDS)
-- ============================================

INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT001', 'Robert Thompson', 98.6, 72, 16, 185.5, '138/88', 98, 'Nurse Johnson', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT002', 'Maria Garcia', 98.4, 88, 18, 145.2, '125/75', 97, 'Nurse Martinez', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT003', 'William Davis', 98.8, 90, 20, 62.4, '110/70', 99, 'Nurse Rodriguez', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT004', 'Linda Wilson', 98.2, 76, 14, 152.8, '122/78', 98, 'Nurse Chen', SYSTIMESTAMP - 3);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT005', 'Christopher Moore', 99.1, 82, 16, 175.3, '135/85', 97, 'Nurse Taylor', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT006', 'Patricia Brown', 98.5, 70, 15, 158.7, '128/76', 98, 'Nurse Kim', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT007', 'Daniel Miller', 98.7, 78, 16, 192.6, '132/86', 96, 'Nurse Davis', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT008', 'Jessica Taylor', 98.9, 85, 18, 98.5, '108/68', 99, 'Nurse Wilson', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT009', 'Thomas Anderson', 98.3, 95, 20, 180.4, '142/90', 95, 'Nurse Anderson', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT010', 'Nancy Martinez', 98.6, 74, 16, 148.3, '118/72', 98, 'Nurse Brown', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT011', 'Kevin White', 98.4, 80, 22, 168.9, '126/80', 94, 'Nurse White', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT012', 'Sarah Jackson', 98.2, 72, 14, 135.2, '115/70', 99, 'Nurse Garcia', SYSTIMESTAMP - 3);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT013', 'Brian Harris', 98.8, 68, 18, 195.8, '145/92', 96, 'Nurse Lee', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT014', 'Michelle Clark', 98.9, 88, 20, 105.3, '112/72', 99, 'Nurse Miller', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT015', 'Steven Lewis', 98.5, 75, 16, 202.5, '130/82', 98, 'Nurse Thompson', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT016', 'Elizabeth Walker', 99.8, 92, 24, 162.4, '128/78', 92, 'Nurse Moore', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT017', 'Richard Hall', 98.3, 70, 14, 178.2, '124/76', 98, 'Nurse Clark', SYSTIMESTAMP - 2);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT018', 'Karen Young', 98.1, 74, 15, 142.8, '118/74', 99, 'Nurse Hall', SYSTIMESTAMP - 3);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT019', 'Joseph King', 98.4, 72, 16, 172.6, '136/84', 97, 'Nurse King', SYSTIMESTAMP - 1);
INSERT INTO HIS_VITALS (VIT_PAT_NUMBER, VIT_PAT_NAME, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT, VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE) VALUES
('PAT020', 'Betty Wright', 98.6, 76, 14, 138.5, '120/78', 98, 'Nurse Wright', SYSTIMESTAMP - 2);

-- ============================================
-- SECTION 11: USER ACCOUNTS (31 USERS)
-- ============================================

-- Admin User Account
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('admin@curewell.com', 'admin', 1, 'System', 'Administrator', 'Active', SYSTIMESTAMP - 1);

-- Doctor User Accounts (10 doctors)
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('sarah.johnson@curewell.com', 'sarah123', 2, 'Sarah', 'Johnson', 'Active', SYSTIMESTAMP - 0.5);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('michael.chen@curewell.com', 'michael123', 2, 'Michael', 'Chen', 'Active', SYSTIMESTAMP - 1);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('emily.rodriguez@curewell.com', 'emily123', 2, 'Emily', 'Rodriguez', 'Active', SYSTIMESTAMP - 2);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('david.patel@curewell.com', 'david123', 2, 'David', 'Patel', 'Active', SYSTIMESTAMP - 1.5);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('jennifer.williams@curewell.com', 'jennifer123', 2, 'Jennifer', 'Williams', 'Active', SYSTIMESTAMP - 1);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('robert.kim@curewell.com', 'robert123', 2, 'Robert', 'Kim', 'Active', SYSTIMESTAMP - 0.75);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('lisa.anderson@curewell.com', 'lisa123', 2, 'Lisa', 'Anderson', 'Active', SYSTIMESTAMP - 1.25);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('james.martinez@curewell.com', 'james123', 2, 'James', 'Martinez', 'Active', SYSTIMESTAMP - 2);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('amanda.taylor@curewell.com', 'amanda123', 2, 'Amanda', 'Taylor', 'Active', SYSTIMESTAMP - 1);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('christopher.lee@curewell.com', 'christopher123', 2, 'Christopher', 'Lee', 'Active', SYSTIMESTAMP - 3);

-- Patient User Accounts (20 patients)
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('robert.thompson@email.com', 'robert123', 3, 'Robert', 'Thompson', 'Active', SYSTIMESTAMP - 5);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('maria.garcia@email.com', 'maria123', 3, 'Maria', 'Garcia', 'Active', SYSTIMESTAMP - 3);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('parent.davis@email.com', 'william123', 3, 'William', 'Davis (Parent)', 'Active', SYSTIMESTAMP - 7);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('linda.wilson@email.com', 'linda123', 3, 'Linda', 'Wilson', 'Active', SYSTIMESTAMP - 10);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('chris.moore@email.com', 'christopher123', 3, 'Christopher', 'Moore', 'Active', SYSTIMESTAMP - 4);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('patricia.brown@email.com', 'patricia123', 3, 'Patricia', 'Brown', 'Active', SYSTIMESTAMP - 8);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('daniel.miller@email.com', 'daniel123', 3, 'Daniel', 'Miller', 'Active', SYSTIMESTAMP - 6);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('parent.taylor@email.com', 'jessica123', 3, 'Jessica', 'Taylor (Parent)', 'Active', SYSTIMESTAMP - 9);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('thomas.anderson@email.com', 'thomas123', 3, 'Thomas', 'Anderson', 'Active', SYSTIMESTAMP - 2);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('nancy.martinez@email.com', 'nancy123', 3, 'Nancy', 'Martinez', 'Active', SYSTIMESTAMP - 12);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('kevin.white@email.com', 'kevin123', 3, 'Kevin', 'White', 'Active', SYSTIMESTAMP - 15);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('sarah.jackson@email.com', 'sarah123', 3, 'Sarah', 'Jackson', 'Active', SYSTIMESTAMP - 11);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('brian.harris@email.com', 'brian123', 3, 'Brian', 'Harris', 'Active', SYSTIMESTAMP - 8);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('parent.clark@email.com', 'michelle123', 3, 'Michelle', 'Clark (Parent)', 'Active', SYSTIMESTAMP - 14);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('steven.lewis@email.com', 'steven123', 3, 'Steven', 'Lewis', 'Active', SYSTIMESTAMP - 13);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('elizabeth.walker@email.com', 'elizabeth123', 3, 'Elizabeth', 'Walker', 'Active', SYSTIMESTAMP - 4);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('richard.hall@email.com', 'richard123', 3, 'Richard', 'Hall', 'Active', SYSTIMESTAMP - 16);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('karen.young@email.com', 'karen123', 3, 'Karen', 'Young', 'Active', SYSTIMESTAMP - 10);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('joseph.king@email.com', 'joseph123', 3, 'Joseph', 'King', 'Active', SYSTIMESTAMP - 9);
INSERT INTO HIS_USERS (USER_EMAIL, USER_PWD, USER_ROLE_ID, USER_FNAME, USER_LNAME, USER_STATUS, USER_LAST_LOGIN) VALUES
('betty.wright@email.com', 'betty123', 3, 'Betty', 'Wright', 'Active', SYSTIMESTAMP - 7);

COMMIT;

SELECT 'Part 2 data insertion completed successfully!' AS Status FROM DUAL;
SELECT 'Accounts, Assets, Equipments, Laboratory, Medical Records, Patient Transfers, Payrolls, Prescriptions, Surgeries, Vitals, Users' AS Summary FROM DUAL;
SELECT 'All insertion data complete!' AS Final_Status FROM DUAL;
