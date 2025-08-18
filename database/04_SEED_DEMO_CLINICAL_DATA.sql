-- ========================================================
-- CUREWELL HMS: SEED DEMO CLINICAL RECORDS
-- Populates rich clinical data for DOC-DEMO and PAT-DEMO
-- ========================================================

-- 1. Configure Demo Doctor Profile
UPDATE HIS_DOCS 
SET DOC_FNAME = 'Alexander',
    DOC_LNAME = 'Hayes',
    DOC_DEPT = 'Cardiology & Internal Medicine',
    DOC_SPECIALIZATION = 'Senior Consultant Cardiologist & Physician',
    DOC_PHONE = '+1 (555) 432-8890',
    DOC_STATUS = 'Active',
    UPDATED_AT = CURRENT_TIMESTAMP
WHERE DOC_NUMBER = 'DOC-DEMO';

-- 2. Configure Demo Patient Profile
UPDATE HIS_PATIENTS 
SET PAT_FNAME = 'Alex',
    PAT_LNAME = 'Morgan',
    PAT_DOB = TO_DATE('1990-05-15', 'YYYY-MM-DD'),
    PAT_AGE = 34,
    PAT_ADDR = '742 Evergreen Terrace, Medical District, Springfield, IL 62704',
    PAT_PHONE = '+1 (555) 839-2041',
    PAT_EMAIL = 'demo.patient@curewell.com',
    PAT_TYPE = 'InPatient',
    PAT_ASSIGNED_DOC = 'DOC-DEMO',
    PAT_AILMENT = 'Hypertensive Heart Disease & Exertional Angina',
    PAT_DISCHARGE_STATUS = 'Admitted',
    PAT_GENDER = 'Male',
    PAT_BLOOD_GROUP = 'O+',
    PAT_EMERGENCY_CONTACT = 'Sarah Morgan (Spouse) - +1 (555) 839-2042',
    UPDATED_AT = CURRENT_TIMESTAMP
WHERE PAT_NUMBER = 'PAT-DEMO';

-- 3. Assigned Patients for DOC-DEMO
MERGE INTO HIS_PATIENTS p
USING (
  SELECT 'PAT-DEMO-001' AS num, 'Eleanor' AS fname, 'Vance' AS lname, '1982-08-20' AS dob, 42 AS age, '184 Pinecrest Avenue, Springfield, IL 62702' AS addr, '+1 (555) 712-4401' AS phone, 'eleanor.vance@curewell-demo.com' AS email, 'OutPatient' AS ptype, 'Type 2 Diabetes Mellitus with Neuropathy' AS ailment, 'Female' AS gender, 'A+' AS blood, 'Thomas Vance (Brother) - +1 (555) 712-4499' AS emerg FROM DUAL UNION ALL
  SELECT 'PAT-DEMO-002', 'Marcus', 'Sterling', '1966-11-14', 58, '502 Harbor View Blvd, Chicago, IL 60601', '+1 (555) 712-4402', 'marcus.sterling@curewell-demo.com', 'InPatient', 'Post-CABG Cardiac Recovery & Hypertension', 'Male', 'B+', 'Clara Sterling (Wife) - +1 (555) 712-4498' FROM DUAL UNION ALL
  SELECT 'PAT-DEMO-003', 'Sophia', 'Chen', '1995-03-28', 29, '917 Willow Creek Way, Peoria, IL 61614', '+1 (555) 712-4403', 'sophia.chen@curewell-demo.com', 'OutPatient', 'Acute Bronchial Asthma Exacerbation', 'Female', 'AB-', 'David Chen (Father) - +1 (555) 712-4497' FROM DUAL UNION ALL
  SELECT 'PAT-DEMO-004', 'James', 'Holloway', '1959-07-04', 65, '330 Elmwood Lane, Rockford, IL 61108', '+1 (555) 712-4404', 'james.holloway@curewell-demo.com', 'InPatient', 'Chronic Kidney Disease Stage 3 & Fluid Overload', 'Male', 'O-', 'Karen Holloway (Daughter) - +1 (555) 712-4496' FROM DUAL UNION ALL
  SELECT 'PAT-DEMO-005', 'Aaliyah', 'Patel', '1986-09-12', 38, '412 North Michigan Ave, Chicago, IL 60611', '+1 (555) 712-4405', 'aaliyah.patel@curewell-demo.com', 'OutPatient', 'Severe Refractory Migraine with Visual Aura', 'Female', 'A-', 'Rohan Patel (Spouse) - +1 (555) 712-4495' FROM DUAL
) src
ON (p.PAT_NUMBER = src.num)
WHEN NOT MATCHED THEN
  INSERT (PAT_ID, PAT_NUMBER, PAT_FNAME, PAT_LNAME, PAT_DOB, PAT_AGE, PAT_ADDR, PAT_PHONE, PAT_EMAIL, PAT_TYPE, PAT_ASSIGNED_DOC, PAT_DATE_JOINED, PAT_AILMENT, PAT_DISCHARGE_STATUS, PAT_GENDER, PAT_BLOOD_GROUP, PAT_EMERGENCY_CONTACT, CREATED_AT, UPDATED_AT)
  VALUES (HIS_PATIENTS_SEQ.NEXTVAL, src.num, src.fname, src.lname, TO_DATE(src.dob, 'YYYY-MM-DD'), src.age, src.addr, src.phone, src.email, src.ptype, 'DOC-DEMO', CURRENT_TIMESTAMP - 14, src.ailment, 'Active', src.gender, src.blood, src.emerg, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
