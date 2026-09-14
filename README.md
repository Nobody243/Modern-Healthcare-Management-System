# CureWell HMS - Modern Healthcare Management System

CureWell HMS is an enterprise hospital information and clinical management platform built with Next.js 16.3.5 App Router (Turbopack), React 19, Oracle Database 19c (Cloud Autonomous & On-Premises), and an interactive 3D WebGL engine. Designed for hospital networks, clinical practitioners, and patients, the platform delivers unified electronic health records (EHR), surgical queue coordination, pharmacy inventory control, departmental payroll disbursals, HIPAA-compliant session governance, and multi-tenant role-based access control.

---

## Table of Contents

1. [Executive Summary and Core Capabilities](#executive-summary-and-core-capabilities)
2. [Technology Stack](#technology-stack)
3. [System Architecture and Portals](#system-architecture-and-portals)
   - [Clinical Doctor Portal](#1-clinical-doctor-portal-doctor)
   - [Patient Health Portal](#2-patient-health-portal-patient)
   - [Enterprise Administrator Portal](#3-enterprise-administrator-portal-admin)
4. [Interactive 3D Interface and High-Performance Frontend](#interactive-3d-interface-and-high-performance-frontend)
5. [Relational Database Architecture (Oracle 19c & Cloud Autonomous)](#relational-database-architecture-oracle-19c--cloud-autonomous)
   - [Schema Design and Normalization](#schema-design-and-normalization)
   - [Complete Table Dictionary (22 Tables)](#complete-table-dictionary-22-tables)
   - [Database Sequences, Triggers and 3NF Views](#database-sequences-triggers-and-3nf-views)
   - [Master Schema & Seed Script](#master-schema--seed-script)
6. [Security and Access Control Architecture](#security-and-access-control-architecture)
7. [API Route Directory (46 REST Handlers)](#api-route-directory-46-rest-handlers)
8. [Demo Accounts and Deletion Protection Policy](#demo-accounts-and-deletion-protection-policy)
9. [Installation and Environment Configuration](#installation-and-environment-configuration)
10. [Available Scripts](#available-scripts)
11. [Project Directory Structure](#project-directory-structure)
12. [Author and Maintainer](#author-and-maintainer)

---

## Executive Summary and Core Capabilities

CureWell HMS bridges clinical medicine, hospital administration, and patient self-service into a singular, high-performance web application:

- **Multi-Tenant RBAC Boundaries:** Isolated workflows and data privacy for Doctors, Patients, and Administrators.
- **Electronic Health Records (EHR):** Comprehensive clinical charting covering diagnoses, longitudinal medical history, allergy tracking, and multi-parametric vital signs.
- **Operating Room & Surgical Scheduling:** Surgical procedure coordination, duration estimates, surgeon assignments, and pre-op documentation.
- **Interactive 3D Medical Assistant:** Real-time 3D robot model integrated via Spline with GPU-accelerated cursor tracking and ambient glowing halo follower.
- **Hospital Operations & Governance:** Departmental staff payroll disbursal, pharmacy batch LOT inventory control, equipment asset tracking, and clinical audit logging.
- **Oracle Cloud Autonomous Integration:** Ephemeral in-memory wallet extraction (`adm-zip`) with zero committed secrets and connection pooling (`queueTimeout: 5000ms`, `poolTimeout: 30s`).
- **HIPAA-Compliant Security:** Automatic 15-minute inactivity session termination, SameSite=Strict HttpOnly session cookies, and demo deletion guards.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.5 (Turbopack) | Server Components, Route Handlers, App Router, Dynamic Rendering |
| **Frontend Library** | React 19.0.0 | Concurrent React, Server Actions, Suspense |
| **Language** | TypeScript 5.x | Strict static typing across models, routes, and components |
| **Database** | Oracle Database 19c / Autonomous Cloud | Relational core with sequences, triggers, foreign keys, and 3NF views |
| **Database Driver** | `oracledb` 6.9.0 & `adm-zip` | Ephemeral cloud wallet connection pooling and parameterized query execution |
| **Styling** | Tailwind CSS 4.0 | Utility-first responsive styling and custom design tokens |
| **UI Components** | shadcn/ui & Radix UI | Accessible dialogs, dropdowns, tables, and form controls |
| **3D Engine** | Spline 3D (`@splinetool/react-spline`) | WebGL robot scene with runtime pointer tracking and parallax tilt |
| **Animations** | Framer Motion 12.x | Physics-based spring animations, GPU transforms, layout morphing |
| **Icons** | Lucide React | Clean, scalable vector iconography |
| **Authentication** | `jose` (JWT) and `bcryptjs` | Signed JWT session cookies and secure password hashing |

---

## System Architecture and Portals

The application enforces strict domain isolation across three specialized role-based portals:

### 1. Clinical Doctor Portal (`/doctor/*`)
Designed for attending physicians, surgeons, and clinical specialists:
- **Patient Rosters:** Comprehensive directory of assigned inpatients and outpatients with active diagnoses and allergy alerts.
- **Biometric Vitals Recording:** Time-series capture and graphing of blood pressure, pulse rate, SpO2 blood oxygen, body temperature, and respiration rate.
- **Surgical Scheduling:** Schedule surgical procedures, assign operating rooms (OR-1 through OR-4), document surgical teams, and track intra-operative progress.
- **Electronic Prescribing:** Formulate prescriptions with precise dosage, administration route, frequency, and duration with automated routing to the hospital pharmacy.
- **Diagnostic Laboratory Orders:** Requisition lab panels (CMP, CBC, Lipid Panels, Cardiac Troponins) and review verified pathologist findings.
- **Departmental Patient Transfers:** Coordinate inter-departmental transfers across ICU, Cardiology, Oncology, Surgery, and General wards.

### 2. Patient Health Portal (`/patient/*`)
Designed for patient self-service and digital health records:
- **Clinical Health Summary:** Overview of assigned primary physicians, active care plans, and upcoming consultations.
- **Digital Prescription Wallet:** Review current medications, dosage instructions, prescribing doctor information, and refill schedules.
- **Biometric Vitals History:** Longitudinal historical logs of vital signs with interactive trend visualization.
- **Laboratory Results:** Verified diagnostic laboratory reports with normal reference ranges and doctor recommendations.
- **Surgical and Procedure History:** Post-operative care guidelines, discharge summaries, and recovery milestones.
- **Profile and Credentials Management:** Contact updates and secure password management.

### 3. Enterprise Administrator Portal (`/admin/*`)
Designed for hospital operations directors and executive management:
- **Departmental Staff Payroll:** Monthly salary processing, tax deductions, clinical allowances, and payment voucher generation.
- **Pharmacy Stock Management:** SKU tracking, batch identification, unit pricing, real-time stock levels, and expiration alerts.
- **Hospital Assets and Equipment:** Lifecycle management for high-value medical devices (MRI machines, ventilators, infusion pumps, defibrillators) including maintenance logs and warranty tracking.
- **Doctor and Patient Accounts:** Staff credentialing, licensing verification, department assignments, and patient registration.
- **Vendor and Supplier Relations:** Contract records, distributor contact details, and supply category management.
- **System Telemetry and Audit Logs:** Oracle transaction latency monitoring, session access logs, and security audit trails.

---

## Interactive 3D Interface and High-Performance Frontend

### 3D Robotic Assistant Interface
The landing page incorporates an interactive 3D WebGL medical android integrated via `@splinetool/react-spline` and Framer Motion:
- **Global Cursor Tracking:** An optimized `requestAnimationFrame` pointer listener on the browser window forwards mouse coordinates to the Spline canvas, ensuring fluid 3D head and eye tracking across the entire viewport.
- **Spring Parallax Tilt:** The container applies subtle 3D perspective rotation (`rotateY`, `rotateX`) responding to cursor offset with zero layout shift.
- **Ambient GPU Cursor Glow:** A zero-rerender `CursorGlow` component provides a cinematic glowing halo that follows cursor movement with spring kinematics.
- **Active Navigation Pill:** Sticky navbar with layout-morphed active section indicator (`layoutId="activeNavIndicator"`), smooth fixed-header offset scrolling, and responsive mobile drawer navigation.

---

## Relational Database Architecture (Oracle 19c & Cloud Autonomous)

### Schema Design and Normalization
The database schema is engineered in Third Normal Form (3NF) to eliminate transitive dependencies, ensure referential integrity, and maximize query performance across clinical workflows.

```
+----------------+       +-------------------+       +---------------+
|  HIS_PATIENTS  |----<  | HIS_APPOINTMENTS  |  >----|   HIS_DOCS    |
+----------------+       +-------------------+       +---------------+
        |                          |                         |
        |---< HIS_VITALS           |---< HIS_SURGERY         |---< HIS_PAYROLLS
        |---< HIS_LABORATORY       |---< HIS_TRANSFERS       |
        >---< HIS_PRESCRIPTIONS >--+---< HIS_PHARMACEUTICALS
```

### Complete Table Dictionary (22 Tables)

| # | Table Name | Primary Key | Description |
| :--- | :--- | :--- | :--- |
| 1 | `HIS_ADMIN` | `AD_ID` | Hospital executive administrators and access credentials |
| 2 | `HIS_DOCS` | `DOC_ID` | Clinical physicians, specialty departments, licensing numbers |
| 3 | `HIS_PATIENTS` | `PAT_ID` | Registered patient demographics, contact details, medical history |
| 4 | `HIS_VITALS` | `VIT_ID` | Time-series patient biometric readings (BP, pulse, SpO2, temp) |
| 5 | `HIS_PRESCRIPTIONS` | `PRES_ID` | Physician prescription records, clinical dosages, duration |
| 6 | `HIS_PHARMACEUTICALS` | `PHAR_ID` | Medicine inventory, batch tracking, stock counts, pricing |
| 7 | `HIS_PHARMACEUTICALS_CATEGORIES` | `PHARM_CAT_ID` | Drug classifications and pharmaceutical categories |
| 8 | `HIS_LABORATORY` | `LAB_ID` | Diagnostic lab test orders, specimen records, pathologist findings |
| 9 | `HIS_SURGERY` | `SURG_ID` | Operating room scheduling, surgical teams, operative logs |
| 10 | `HIS_PATIENT_TRANSFER` | `PT_ID` | Inter-departmental patient movement and transfer approvals |
| 11 | `HIS_MEDICAL_RECORDS` | `MDR_ID` | Longitudinal patient clinical consultation documentation |
| 12 | `HIS_PAYROLLS` | `PAY_ID` | Staff monthly salary disbursals, deductions, allowances |
| 13 | `HIS_EQUIPMENTS` | `EQP_ID` | Medical devices, ventilators, monitors, maintenance logs |
| 14 | `HIS_ASSETS` | `ASST_ID` | Hospital physical infrastructure assets and valuations |
| 15 | `HIS_ACCOUNTS` | `ACC_ID` | Financial ledger, billing records, operational revenue |
| 16 | `HIS_VENDOR` | `V_ID` | Pharmaceutical suppliers, equipment vendors, contact records |
| 17 | `HIS_USERS` | `USER_ID` | Unified multi-tenant authentication credentials and hashes |
| 18 | `HIS_ROLES` | `ROLE_ID` | RBAC role definitions (Admin, Doctor, Patient) |
| 19 | `HIS_PRIVILEGES` | `PRIV_ID` | Fine-grained system permissions |
| 20 | `HIS_ROLE_PRIVILEGES` | `RP_ID` | Mapping table connecting roles to system privileges |
| 21 | `HIS_USER_ROLES` | `UR_ID` | Mapping table connecting user accounts to specific roles |
| 22 | `HIS_PWDRESETS` | `ID` | Password reset tokens and expiration tracking |

### Database Sequences, Triggers and 3NF Views
- **Auto-Increment Identity:** Every primary table uses an Oracle sequence (`HIS_*_SEQ`) with a `BEFORE INSERT` trigger.
- **Relational 3NF Views:**
  - `V_LABORATORY` (Joins laboratory orders with patient and doctor profiles)
  - `V_MEDICAL_RECORDS` (Joins clinical consultation records with patient demographics)
  - `V_PATIENT_TRANSFER` (Joins transfers with patient and authorizing physician)
  - `V_PAYROLLS` (Joins salary records with doctor department data)
  - `V_PRESCRIPTIONS` (Joins medication orders with patient and doctor details)
  - `V_SURGERY` (Joins operating room logs with patient and surgeon details)
  - `V_VITALS` (Joins biometric logs with patient data)
  - `V_DOCTOR_PATIENTS` (Active doctor-patient relationship rosters)

### Master Schema & Seed Script
The entire database can be created, indexed, and populated with a single script:
```sql
@database/MASTER_SCHEMA_AND_SEED.sql
```
This script initializes all 22 tables, 22 sequences, 22 triggers, 8 views, 10 performance indexes, and seeds:
- 11 Doctors (`DOC-DEMO`, `DOC001`–`DOC010`)
- 26 Patients (`PAT-DEMO`, `PAT-DEMO-001`–`005`, `PAT001`–`PAT020`)
- 15 Vendors, 15 Pharma Categories, 15 Pharmaceuticals
- 15 Financial Accounts, 15 Assets, 15 Equipments
- Comprehensive clinical records, lab tests, prescriptions, surgeries, and vitals

---

## Security and Access Control Architecture

1. **Cryptographic JWT Session Cookies:**
   - Tokens are signed with HS256 encryption via `jose`.
   - Delivered exclusively via `HttpOnly`, `SameSite=Lax/Strict`, `Secure` cookies (`session`), preventing client script access and XSS credential exfiltration.

2. **15-Minute Inactivity Auto-Logout:**
   - Both client-side activity listeners and server-side middleware enforce a strict 15-minute inactivity threshold.
   - Prolonged idle sessions or machine sleep/suspend events automatically terminate the session.

3. **Parameterized SQL Queries:**
   - All queries executed through `lib/db.ts` use bind parameters (`:1`, `:2`), eliminating SQL injection vulnerabilities.

4. **Ephemeral Cloud Wallet Architecture:**
   - Oracle Autonomous Database wallet `.zip` is extracted in-memory to temporary runtime storage (`/tmp/oracle_wallet`) via base64 environment decoding. No sensitive certificate binaries or credentials are committed.

5. **Automated Demo Deletion Protection:**
   - Destructive operations (`DELETE`) from demo accounts (`demo.*`) are intercepted with descriptive notices, preserving public demo data integrity.

---

## API Route Directory (46 REST Handlers)

### Authentication and Session APIs
- `POST /api/test-auth` - Authenticate user credentials and issue signed JWT session cookie.
- `POST /api/auth/logout` - Invalidate active session and clear authentication cookie.
- `POST /api/auth/change-password` - Update account password with bcrypt hashing.
- `POST /api/patient/update-password` - Patient self-service password update.
- `POST /api/patient/update-profile` - Patient profile demographic update.

### Doctor and Clinical APIs
- `GET /api/doctors/me` - Retrieve authenticated doctor profile and department info.
- `GET /api/doctors` - Directory of all clinical physicians and specialties.
- `GET /api/doctors/[id]` - Individual physician details and credentials.
- `GET /api/doctors/[id]/patients` - Patients assigned to specific physician.
- `GET /api/doctors/[id]/vitals` - Vitals recorded by specific physician.
- `GET /api/doctors/[id]/prescriptions` - Prescriptions authored by physician.
- `GET /api/doctors/[id]/surgeries` - Surgical procedures scheduled for physician.
- `GET /api/doctors/[id]/laboratory` - Lab tests requested by physician.
- `GET /api/doctors/[id]/records` - Clinical consultation records for physician.
- `GET /api/doctors/[id]/patient-transfers` - Department transfers managed by physician.

### Clinical Management APIs (CRUD)
- `GET, POST /api/patients` - List all registered patients / Enroll new patient.
- `GET, POST /api/vitals` - Query biometric history / Record new vital signs.
- `GET, POST /api/prescriptions` - List prescriptions / Authorize new prescription.
- `GET, POST /api/laboratory` - Retrieve lab tests / Order new diagnostic lab panel.
- `GET, POST /api/surgery` - Operating room bookings / Schedule new surgery.
- `GET, POST /api/records` - Medical history entries / Create consultation note.
- `GET, POST /api/patient-transfers` - Transfer audits / Initiate department transfer.
- `GET, PUT, DELETE /api/patient-transfers/[id]` - Transfer details, update, and resolve.

### Hospital Operations and Administration APIs
- `GET, POST /api/payrolls` - Retrieve payroll records / Process monthly staff salaries.
- `GET, POST /api/pharmaceuticals` - Pharmacy stock levels / Add new drug inventory.
- `GET, POST /api/pharmaceutical-categories` - Pharmaceutical classifications.
- `GET, POST /api/equipments` - Medical equipment assets and maintenance status.
- `GET, POST /api/assets` - Hospital physical property and infrastructure assets.
- `GET, POST /api/accounts` - Financial ledger transactions and billing entries.
- `GET, POST /api/vendors` - Supplier contacts and pharmaceutical vendors.

---

## Demo Accounts and Deletion Protection Policy

For instant evaluation, pre-configured accounts are available on the login screen (`/login`):

| Role | Demo Login | Password | Alternate / Standard Login | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `demo.admin@curewell.com` | `demo123` | `admin@curewell.com` / `admin` | Full hospital operations, payroll, inventory, assets |
| **Doctor** | `demo.doctor@curewell.com` | `demo123` | `s.jenkins@curewell.com` / `doctor` | Patient rosters, vitals charting, surgeries, prescriptions |
| **Patient** | `demo.patient@curewell.com` | `demo123` | `john.doe@email.com` / `patient123` | Personal health records, lab results, digital prescriptions |

---

## Installation and Environment Configuration

### Prerequisites
- Node.js 18.18.0+ or Node.js 20.x
- Oracle Database 19c (Local XE, Enterprise, or Oracle Cloud Autonomous Database)

### Step 1: Clone Repository
```bash
git clone https://github.com/Nobody243/Modern-Healthcare-Management-System.git
cd Modern-Healthcare-Management-System
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Database Schema Initialization
Execute the unified master SQL script using Oracle SQL Developer, SQL*Plus, or SQLcl:
```sql
@database/MASTER_SCHEMA_AND_SEED.sql
```

### Step 4: Configure Environment Variables
Create a `.env.local` file in the project root:

**For Oracle Cloud Autonomous Database (Wallet-based / Vercel):**
```env
ORACLE_USER=admin
ORACLE_PASSWORD=YourOraclePassword
ORACLE_TNS_NAME=curewellhms_high
ORACLE_WALLET_PASSWORD=YourWalletPassword
ORACLE_WALLET_BASE64=base64_encoded_wallet_zip_string

JWT_SECRET=your_long_cryptographically_secure_random_key_here
```

**For Local Oracle Database:**
```env
DB_USER=SCHEMA_PROJECT
DB_PASSWORD=your_local_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1

JWT_SECRET=your_long_cryptographically_secure_random_key_here
```

### Step 5: Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

---

## Available Scripts

- `npm run dev` - Launches Next.js in development mode with Turbopack fast refresh.
- `npm run build` - Compiles the application and verifies all static and dynamic route builds.
- `npm run start` - Starts the Next.js production server.
- `npm run lint` - Executes ESLint checks across the codebase.

---

## Project Directory Structure

```
Modern-Healthcare-Management-System/
├── app/
│   ├── (auth)/
│   │   └── login/                  # Multi-role authentication entry point
│   ├── admin/                      # Enterprise Administrator Portal pages
│   │   ├── accounts/               # Financial accounts & general ledger
│   │   ├── assets/                 # Hospital asset inventory
│   │   ├── dashboard/              # Executive analytics and operations KPIs
│   │   ├── doctors/                # Staff physician credentialing
│   │   ├── equipments/             # Medical device lifecycle management
│   │   ├── laboratory/             # Diagnostic laboratory oversight
│   │   ├── patient-transfers/      # Department transfer audit logs
│   │   ├── patients/               # Patient master registry
│   │   ├── payrolls/               # Staff payroll processing
│   │   ├── pharmaceuticals/        # Pharmacy inventory & batch tracking
│   │   ├── prescriptions/          # Hospital prescription registry
│   │   ├── records/                # Longitudinal medical record index
│   │   ├── surgery/                # Hospital surgical schedules
│   │   ├── vendors/                # Pharmaceutical and device suppliers
│   │   └── vitals/                 # Hospital-wide biometric logs
│   ├── api/                        # 46 Next.js REST API Route Handlers
│   ├── doctor/                     # Clinical Doctor Portal pages
│   │   ├── dashboard/              # Physician workspace and shift summary
│   │   ├── laboratory/             # Diagnostic lab orders & reviews
│   │   ├── patient-transfers/      # Department transfer coordination
│   │   ├── patients/               # Assigned patient EHR charts
│   │   ├── prescriptions/          # Electronic prescription authoring
│   │   ├── records/                # Clinical consultation documentation
│   │   ├── surgeries/              # Surgical schedules and OR updates
│   │   └── vitals/                 # Patient biometric telemetry recorder
│   ├── patient/                    # Patient Health Portal pages
│   │   ├── dashboard/              # Patient personal health overview
│   │   ├── laboratory/             # Verified lab test reports
│   │   ├── prescriptions/          # Digital prescription wallet
│   │   ├── profile/                # Demographic profile & security settings
│   │   ├── records/                # Clinical history documentation
│   │   ├── surgeries/              # Surgical procedures & recovery care
│   │   └── vitals/                 # Historical vital signs tracker
│   ├── layout.tsx                  # Global root layout with theme providers
│   ├── page.tsx                    # Refactored home landing page with 3D Robot & GPU Glow
│   └── unauthorized/               # Access control violation fallback page
├── components/
│   ├── ui/                         # Reusable UI primitives (buttons, dialogs, spline)
│   │   └── spline.tsx              # Full-bleed 3D Spline scene component with pointer tracking
│   └── shared/                     # Cross-portal navigational headers & sidebars
├── database/                       # Oracle 19c 3NF unified SQL schema and master seed
│   └── MASTER_SCHEMA_AND_SEED.sql  # Complete DDL, DML, triggers, views, and seed data
├── hooks/                          # Custom React hooks (inactivity timeout, media queries)
├── lib/
│   ├── auth.ts                     # JWT signing, verification, and cookie utilities
│   ├── db.ts                       # Oracle connection pool wrapper with ephemeral wallet support
│   └── utils.ts                    # Class name mergers and formatting helpers
├── middleware.ts                   # Role-based route guard and session validator
├── package.json                    # Project dependencies and npm scripts
└── README.md                       # Comprehensive platform documentation
```

---

## Author and Maintainer

- **Nobody243** (`01-135232-062@student.bahria.edu.pk`)
- GitHub Repository: [Nobody243/Modern-Healthcare-Management-System](https://github.com/Nobody243/Modern-Healthcare-Management-System)
