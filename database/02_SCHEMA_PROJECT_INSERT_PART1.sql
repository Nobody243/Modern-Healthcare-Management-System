--------------------------------------------------------
-- HOSPITAL MANAGEMENT SYSTEM (HMS)
-- Data Insertion Script - Oracle SQL Developer
-- Database: SCHEMA_PROJECT
-- 
-- Contents:
-- - 1 Admin user
-- - 10 Doctors (various specializations)
-- - 20 Patients (assigned to doctors)
-- - 15 Vendors
-- - 12 Pharmaceutical categories
-- - 15 Pharmaceuticals
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
-- - Complete user/role system
--------------------------------------------------------

-- Set date format
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

-- ============================================
-- SECTION 1: ROLES AND PRIVILEGES
-- ============================================

-- Insert Roles
INSERT INTO HIS_ROLES (ROLE_NAME, ROLE_DESC, ROLE_LEVEL) VALUES
('Admin', 'Full system administrator access', 10);
INSERT INTO HIS_ROLES (ROLE_NAME, ROLE_DESC, ROLE_LEVEL) VALUES
('Doctor', 'Medical doctor with patient care access', 7);
INSERT INTO HIS_ROLES (ROLE_NAME, ROLE_DESC, ROLE_LEVEL) VALUES
('Patient', 'Patient with limited access to own records', 3);

-- Insert Privileges
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('admin.all', 'Full administrative access', 'Admin');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('doctor.view_patients', 'View assigned patients', 'Patients');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('doctor.prescribe', 'Create prescriptions', 'Prescriptions');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('doctor.view_vitals', 'View patient vitals', 'Vitals');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('doctor.order_labs', 'Order laboratory tests', 'Laboratory');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('patient.view_prescriptions', 'View own prescriptions', 'Prescriptions');
INSERT INTO HIS_PRIVILEGES (PRIV_NAME, PRIV_DESC, PRIV_MODULE) VALUES
('patient.view_vitals', 'View own vitals', 'Vitals');

-- Assign Privileges to Roles
-- Admin gets all privileges
INSERT INTO HIS_ROLE_PRIVILEGES (ROLE_ID, PRIV_ID, GRANTED_BY)
SELECT 1, PRIV_ID, 'SYSTEM' FROM HIS_PRIVILEGES;

-- Doctor gets doctor privileges
INSERT INTO HIS_ROLE_PRIVILEGES (ROLE_ID, PRIV_ID, GRANTED_BY)
SELECT 2, PRIV_ID, 'SYSTEM' 
FROM HIS_PRIVILEGES 
WHERE PRIV_NAME LIKE 'doctor.%';

-- Patient gets patient privileges
INSERT INTO HIS_ROLE_PRIVILEGES (ROLE_ID, PRIV_ID, GRANTED_BY)
SELECT 3, PRIV_ID, 'SYSTEM' 
FROM HIS_PRIVILEGES 
WHERE PRIV_NAME LIKE 'patient.%';

-- ============================================
-- SECTION 2: ADMIN DATA
-- ============================================

-- Insert Admin user
INSERT INTO HIS_ADMIN (AD_FNAME, AD_LNAME, AD_EMAIL, AD_PWD) VALUES
('System', 'Administrator', 'admin@curewell.com', 'admin');

-- ============================================
-- SECTION 3: VENDOR DATA
-- ============================================

INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND001', 'MediSupply Corp', '123 Medical Plaza, New York, NY 10001', '+1-212-555-0100', 'contact@medisupply.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND002', 'PharmaCare International', '456 Pharmacy Ave, Los Angeles, CA 90001', '+1-310-555-0200', 'sales@pharmacare.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND003', 'HealthTech Solutions', '789 Innovation Dr, Boston, MA 02101', '+1-617-555-0300', 'info@healthtech.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND004', 'Global Medical Supplies', '321 Commerce St, Chicago, IL 60601', '+1-312-555-0400', 'orders@globalmed.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND005', 'Surgical Equipment Inc', '654 Industry Blvd, Houston, TX 77001', '+1-713-555-0500', 'sales@surgequip.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND006', 'BioLab Diagnostics', '987 Research Pkwy, San Francisco, CA 94101', '+1-415-555-0600', 'contact@biolabdx.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND007', 'CardioMed Devices', '147 Heart Lane, Seattle, WA 98101', '+1-206-555-0700', 'support@cardiomed.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND008', 'NeuroCare Technologies', '258 Brain Ave, Philadelphia, PA 19101', '+1-215-555-0800', 'info@neurocare.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND009', 'PediMed Supplies', '369 Children Way, Atlanta, GA 30301', '+1-404-555-0900', 'orders@pedimed.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND010', 'Orthopedic Solutions', '741 Bone Street, Denver, CO 80201', '+1-303-555-1000', 'sales@orthosol.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND011', 'RadiologyPro Equipment', '852 Imaging Blvd, Miami, FL 33101', '+1-305-555-1100', 'contact@radpro.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND012', 'Emergency Medical Supply', '963 Urgent Care Dr, Phoenix, AZ 85001', '+1-602-555-1200', 'ems@emergency.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND013', 'Wellness Pharmaceuticals', '159 Health Plaza, Portland, OR 97201', '+1-503-555-1300', 'info@wellnesspharma.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND014', 'Hospital Furniture Co', '357 Comfort Ave, Dallas, TX 75201', '+1-214-555-1400', 'sales@hospfurn.com');
INSERT INTO HIS_VENDOR (V_NUMBER, V_NAME, V_ADR, V_PHONE, V_EMAIL) VALUES
('VND015', 'Sterilization Systems Ltd', '486 Clean Street, Minneapolis, MN 55401', '+1-612-555-1500', 'contact@sterilsys.com');

-- ============================================
-- SECTION 4: PHARMACEUTICAL CATEGORIES
-- ============================================

INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Analgesics', 'Pain relief medications including NSAIDs and opioids');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Antibiotics', 'Antimicrobial agents for bacterial infections');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Cardiovascular', 'Heart and blood vessel medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Antidiabetics', 'Diabetes management medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Antihypertensives', 'Blood pressure control medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Respiratory', 'Asthma and respiratory medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Gastrointestinal', 'Digestive system medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Anticoagulants', 'Blood thinning medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Antidepressants', 'Mental health medications');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Vitamins', 'Nutritional supplements');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Antivirals', 'Viral infection treatments');
INSERT INTO HIS_PHARMACEUTICALS_CATEGORIES (PHARM_CAT_NAME, PHARM_CAT_DESC) VALUES
('Hormones', 'Endocrine system medications');

-- ============================================
-- SECTION 5: DOCTORS (10 DOCTORS)
-- ============================================

INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Sarah', 'Johnson', 'sarah.johnson@curewell.com', 'sarah123', 'Cardiology', 'DOC001', 'Cardiologist', '+1-555-2001', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Michael', 'Chen', 'michael.chen@curewell.com', 'michael123', 'Neurology', 'DOC002', 'Neurologist', '+1-555-2002', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Emily', 'Rodriguez', 'emily.rodriguez@curewell.com', 'emily123', 'Pediatrics', 'DOC003', 'Pediatrician', '+1-555-2003', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('David', 'Patel', 'david.patel@curewell.com', 'david123', 'Orthopedics', 'DOC004', 'Orthopedic Surgeon', '+1-555-2004', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Jennifer', 'Williams', 'jennifer.williams@curewell.com', 'jennifer123', 'Endocrinology', 'DOC005', 'Endocrinologist', '+1-555-2005', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Robert', 'Kim', 'robert.kim@curewell.com', 'robert123', 'Emergency Medicine', 'DOC006', 'Emergency Physician', '+1-555-2006', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Lisa', 'Anderson', 'lisa.anderson@curewell.com', 'lisa123', 'Oncology', 'DOC007', 'Oncologist', '+1-555-2007', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('James', 'Martinez', 'james.martinez@curewell.com', 'james123', 'Pulmonology', 'DOC008', 'Pulmonologist', '+1-555-2008', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Amanda', 'Taylor', 'amanda.taylor@curewell.com', 'amanda123', 'Psychiatry', 'DOC009', 'Psychiatrist', '+1-555-2009', 'Active');
INSERT INTO HIS_DOCS (DOC_FNAME, DOC_LNAME, DOC_EMAIL, DOC_PWD, DOC_DEPT, DOC_NUMBER, DOC_SPECIALIZATION, DOC_PHONE, DOC_STATUS) VALUES
('Christopher', 'Lee', 'christopher.lee@curewell.com', 'christopher123', 'Radiology', 'DOC010', 'Radiologist', '+1-555-2010', 'Active');

-- ============================================
-- SECTION 6: PATIENTS (20 PATIENTS)
-- ============================================

INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Robert', 'Thompson', TO_DATE('1985-03-15', 'YYYY-MM-DD'), 39, 'PAT001', '123 Oak Street, Springfield, IL 62701', '+1-555-3001', 'robert.thompson@email.com', 'OutPatient', 'DOC001', 'Hypertension', 'Male', 'A+', '+1-555-3901');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Maria', 'Garcia', TO_DATE('1992-07-22', 'YYYY-MM-DD'), 32, 'PAT002', '456 Maple Avenue, Chicago, IL 60601', '+1-555-3002', 'maria.garcia@email.com', 'InPatient', 'DOC001', 'Coronary Artery Disease', 'Female', 'O+', '+1-555-3902');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('William', 'Davis', TO_DATE('2015-11-08', 'YYYY-MM-DD'), 8, 'PAT003', '789 Pine Road, Naperville, IL 60540', '+1-555-3003', 'parent.davis@email.com', 'OutPatient', 'DOC003', 'Childhood Asthma', 'Male', 'B+', '+1-555-3903');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Linda', 'Wilson', TO_DATE('1978-02-14', 'YYYY-MM-DD'), 46, 'PAT004', '321 Elm Street, Peoria, IL 61602', '+1-555-3004', 'linda.wilson@email.com', 'OutPatient', 'DOC002', 'Migraine', 'Female', 'AB+', '+1-555-3904');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Christopher', 'Moore', TO_DATE('1990-09-30', 'YYYY-MM-DD'), 34, 'PAT005', '654 Birch Lane, Rockford, IL 61101', '+1-555-3005', 'chris.moore@email.com', 'InPatient', 'DOC002', 'Severe Headache and Dizziness', 'Male', 'O-', '+1-555-3905');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Patricia', 'Brown', TO_DATE('1965-04-18', 'YYYY-MM-DD'), 59, 'PAT006', '147 Cedar Ave, Aurora, IL 60504', '+1-555-3006', 'patricia.brown@email.com', 'InPatient', 'DOC004', 'Hip Fracture', 'Female', 'A-', '+1-555-3906');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Daniel', 'Miller', TO_DATE('1988-12-05', 'YYYY-MM-DD'), 36, 'PAT007', '258 Walnut St, Joliet, IL 60431', '+1-555-3007', 'daniel.miller@email.com', 'OutPatient', 'DOC005', 'Type 2 Diabetes', 'Male', 'B-', '+1-555-3907');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Jessica', 'Taylor', TO_DATE('2010-06-20', 'YYYY-MM-DD'), 14, 'PAT008', '369 Spruce Dr, Evanston, IL 60201', '+1-555-3008', 'parent.taylor@email.com', 'OutPatient', 'DOC003', 'Allergic Rhinitis', 'Female', 'O+', '+1-555-3908');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Thomas', 'Anderson', TO_DATE('1975-08-11', 'YYYY-MM-DD'), 49, 'PAT009', '741 Ash Boulevard, Schaumburg, IL 60193', '+1-555-3009', 'thomas.anderson@email.com', 'InPatient', 'DOC006', 'Chest Pain - Suspected MI', 'Male', 'A+', '+1-555-3909');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Nancy', 'Martinez', TO_DATE('1970-01-25', 'YYYY-MM-DD'), 54, 'PAT010', '852 Hickory Ln, Skokie, IL 60076', '+1-555-3010', 'nancy.martinez@email.com', 'InPatient', 'DOC007', 'Breast Cancer Stage II', 'Female', 'AB-', '+1-555-3910');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Kevin', 'White', TO_DATE('1982-05-30', 'YYYY-MM-DD'), 42, 'PAT011', '963 Poplar Rd, Oak Park, IL 60301', '+1-555-3011', 'kevin.white@email.com', 'OutPatient', 'DOC008', 'Chronic Bronchitis', 'Male', 'B+', '+1-555-3911');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Sarah', 'Jackson', TO_DATE('1995-09-14', 'YYYY-MM-DD'), 29, 'PAT012', '159 Willow Way, Bolingbrook, IL 60440', '+1-555-3012', 'sarah.jackson@email.com', 'OutPatient', 'DOC009', 'Major Depression', 'Female', 'O-', '+1-555-3912');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Brian', 'Harris', TO_DATE('1958-11-03', 'YYYY-MM-DD'), 66, 'PAT013', '357 Magnolia St, Wheaton, IL 60187', '+1-555-3013', 'brian.harris@email.com', 'InPatient', 'DOC001', 'Congestive Heart Failure', 'Male', 'A-', '+1-555-3913');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Michelle', 'Clark', TO_DATE('2012-03-28', 'YYYY-MM-DD'), 12, 'PAT014', '486 Dogwood Ave, Downers Grove, IL 60515', '+1-555-3014', 'parent.clark@email.com', 'OutPatient', 'DOC003', 'Type 1 Diabetes', 'Female', 'B-', '+1-555-3914');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Steven', 'Lewis', TO_DATE('1980-07-19', 'YYYY-MM-DD'), 44, 'PAT015', '571 Redwood Terrace, Palatine, IL 60067', '+1-555-3015', 'steven.lewis@email.com', 'OutPatient', 'DOC004', 'Knee Osteoarthritis', 'Male', 'O+', '+1-555-3915');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Elizabeth', 'Walker', TO_DATE('1968-02-07', 'YYYY-MM-DD'), 56, 'PAT016', '682 Sycamore Pl, Des Plaines, IL 60016', '+1-555-3016', 'elizabeth.walker@email.com', 'InPatient', 'DOC008', 'Pneumonia', 'Female', 'AB+', '+1-555-3916');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Richard', 'Hall', TO_DATE('1973-10-22', 'YYYY-MM-DD'), 51, 'PAT017', '793 Beech Court, Arlington Heights, IL 60004', '+1-555-3017', 'richard.hall@email.com', 'OutPatient', 'DOC005', 'Hypothyroidism', 'Male', 'A+', '+1-555-3917');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Karen', 'Young', TO_DATE('1987-04-12', 'YYYY-MM-DD'), 37, 'PAT018', '804 Chestnut Circle, Mount Prospect, IL 60056', '+1-555-3018', 'karen.young@email.com', 'OutPatient', 'DOC009', 'Anxiety Disorder', 'Female', 'B+', '+1-555-3918');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Joseph', 'King', TO_DATE('1962-12-30', 'YYYY-MM-DD'), 62, 'PAT019', '915 Laurel Drive, Hoffman Estates, IL 60169', '+1-555-3019', 'joseph.king@email.com', 'InPatient', 'DOC007', 'Prostate Cancer Stage I', 'Male', 'O-', '+1-555-3919');
INSERT INTO HIS_PATIENTS (PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_NUMBER, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_AILMENT, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT) VALUES
('Betty', 'Wright', TO_DATE('1955-06-16', 'YYYY-MM-DD'), 69, 'PAT020', '126 Oakwood Ave, Park Ridge, IL 60068', '+1-555-3020', 'betty.wright@email.com', 'OutPatient', 'DOC002', 'Parkinsons Disease', 'Female', 'A-', '+1-555-3920');

-- ============================================
-- SECTION 7: PHARMACEUTICALS (15 ITEMS)
-- ============================================

INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Ibuprofen 400mg', 'BAR001', 5000, 0.15, 'Analgesics', 'PharmaCare International', TO_DATE('2026-12-31', 'YYYY-MM-DD'), TO_DATE('2024-01-15', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Amoxicillin 500mg', 'BAR002', 4000, 0.25, 'Antibiotics', 'PharmaCare International', TO_DATE('2025-12-31', 'YYYY-MM-DD'), TO_DATE('2023-12-01', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Atorvastatin 20mg', 'BAR003', 6000, 0.30, 'Cardiovascular', 'MediSupply Corp', TO_DATE('2027-03-31', 'YYYY-MM-DD'), TO_DATE('2024-03-15', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Metformin 850mg', 'BAR004', 4500, 0.18, 'Antidiabetics', 'Wellness Pharmaceuticals', TO_DATE('2026-08-30', 'YYYY-MM-DD'), TO_DATE('2024-02-20', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Lisinopril 10mg', 'BAR005', 3800, 0.22, 'Antihypertensives', 'MediSupply Corp', TO_DATE('2026-06-15', 'YYYY-MM-DD'), TO_DATE('2024-01-10', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Albuterol Inhaler', 'BAR006', 2500, 8.50, 'Respiratory', 'PharmaCare International', TO_DATE('2026-09-30', 'YYYY-MM-DD'), TO_DATE('2024-03-01', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Omeprazole 20mg', 'BAR007', 3500, 0.35, 'Gastrointestinal', 'Wellness Pharmaceuticals', TO_DATE('2026-11-20', 'YYYY-MM-DD'), TO_DATE('2024-02-10', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Warfarin 5mg', 'BAR008', 2000, 0.40, 'Anticoagulants', 'MediSupply Corp', TO_DATE('2027-01-31', 'YYYY-MM-DD'), TO_DATE('2024-04-01', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Sertraline 50mg', 'BAR009', 3200, 0.45, 'Antidepressants', 'PharmaCare International', TO_DATE('2026-10-15', 'YYYY-MM-DD'), TO_DATE('2024-01-20', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Vitamin D3 1000IU', 'BAR010', 7000, 0.08, 'Vitamins', 'Wellness Pharmaceuticals', TO_DATE('2027-06-30', 'YYYY-MM-DD'), TO_DATE('2024-03-10', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Azithromycin 250mg', 'BAR011', 2800, 0.55, 'Antibiotics', 'PharmaCare International', TO_DATE('2026-07-31', 'YYYY-MM-DD'), TO_DATE('2024-02-05', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Oseltamivir 75mg', 'BAR012', 1500, 3.20, 'Antivirals', 'MediSupply Corp', TO_DATE('2026-04-30', 'YYYY-MM-DD'), TO_DATE('2024-01-25', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Levothyroxine 50mcg', 'BAR013', 4200, 0.20, 'Hormones', 'Wellness Pharmaceuticals', TO_DATE('2027-02-28', 'YYYY-MM-DD'), TO_DATE('2024-03-05', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Aspirin 81mg', 'BAR014', 8000, 0.05, 'Cardiovascular', 'PharmaCare International', TO_DATE('2028-12-31', 'YYYY-MM-DD'), TO_DATE('2024-04-10', 'YYYY-MM-DD'));
INSERT INTO HIS_PHARMACEUTICALS (PHAR_NAME, PHAR_BCODE, PHAR_QTY, PHAR_UNIT_PRICE, PHAR_CAT, PHAR_VENDOR, PHAR_EXPIRY_DATE, PHAR_MANUFACTURING_DATE) VALUES
('Prednisone 10mg', 'BAR015', 3000, 0.28, 'Hormones', 'MediSupply Corp', TO_DATE('2026-05-31', 'YYYY-MM-DD'), TO_DATE('2024-02-15', 'YYYY-MM-DD'));

COMMIT;

SELECT 'Data insertion completed successfully!' AS Status FROM DUAL;
SELECT '1 Admin, 10 Doctors, 20 Patients, 15 Vendors, 15 Pharmaceuticals' AS Summary FROM DUAL;
SELECT 'Run the next script (02_SCHEMA_PROJECT_INSERT_PART2.sql) for remaining data' AS Next_Step FROM DUAL;
