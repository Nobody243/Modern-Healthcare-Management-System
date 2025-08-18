# CureWell HMS - Modern Healthcare Management System

CureWell HMS is an enterprise hospital information and clinical management platform built with Next.js 16 App Router, React 19, Oracle Database 19c, and an interactive 3D WebGL engine. Designed for hospital networks, clinical practitioners, and patients, the platform delivers unified electronic health records (EHR), real-time clinical telemetry, surgical queue coordination, pharmacy inventory control, departmental payroll disbursals, and multi-tenant role-based access control.

---

## Table of Contents

1. [Executive Summary and Core Capabilities](#executive-summary-and-core-capabilities)
2. [Technology Stack](#technology-stack)
3. [System Architecture and Portals](#system-architecture-and-portals)
   - [Clinical Doctor Portal](#1-clinical-doctor-portal-doctor)
   - [Patient Health Portal](#2-patient-health-portal-patient)
   - [Enterprise Administrator Portal](#3-enterprise-administrator-portal-admin)
4. [Interactive 3D Interface and Live Clinical Telemetry](#interactive-3d-interface-and-live-clinical-telemetry)
5. [Relational Database Architecture (Oracle 19c)](#relational-database-architecture-oracle-19c)
   - [Schema Design and Normalization](#schema-design-and-normalization)
   - [Complete Table Dictionary (22 Tables)](#complete-table-dictionary-22-tables)
   - [Database Sequences and Automated Triggers](#database-sequences-and-automated-triggers)
   - [Materialized Views and Aggregations](#materialized-views-and-aggregations)
6. [Security and Access Control Architecture](#security-and-access-control-architecture)
7. [API Route Directory](#api-route-directory)
8. [Demo Accounts and Deletion Protection Policy](#demo-accounts-and-deletion-protection-policy)
9. [Installation and Environment Configuration](#installation-and-environment-configuration)
10. [Available Scripts](#available-scripts)
11. [Project Directory Structure](#project-directory-structure)
12. [Author and Maintainer](#author-and-maintainer)

---

## Executive Summary and Core Capabilities

CureWell HMS bridges clinical medicine, hospital administration, and patient self-service into a singular, high-performance web application. Key highlights include:

- Multi-tenant role-based access control with distinct operational boundaries for Doctors, Patients, and Administrators.
- Real-time clinical telemetry with live vital signs recording and animated ECG monitoring.
- Interactive 3D robotic assistance powered by Spline and Framer Motion with global pointer tracking and hardware acceleration.
- Electronic Health Records (EHR) covering diagnoses, medical history, lab requisitions, and surgical workflows.
- Full-spectrum hospital operations including staff payroll processing, pharmacy batch management, and equipment asset tracking.
- Enterprise-grade Oracle 19c database backend engineered in Third Normal Form (3NF) with parameterized queries and ACID transaction safety.
- Automated demo protection guards preventing accidental deletion of sample seed data while allowing full CRUD evaluation.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.0.6 (Turbopack) | Server Components, Route Handlers, App Router |
| **Frontend Library** | React 19.0.0 | Client interactivity, state management, Suspense |
| **Language** | TypeScript 5.x | Strict static typing across models, routes, and components |
| **Database** | Oracle Database 19c | Relational core with sequences, triggers, constraints |
| **Database Driver** | `oracledb` 6.6.0 | Oracle connection pooling and parameterized query execution |
| **Styling** | Tailwind CSS 4.0 | Utility-first responsive styling and custom design system |
| **UI Components** | shadcn/ui | Radix UI primitives, accessible dialogs, dropdowns, tables |
| **3D Engine** | Spline 3D (`@splinetool/react-spline`) | Interactive WebGL robot scene with runtime event binding |
| **Animations** | Framer Motion 12.x | Physics-based spring animations, layout transitions |
| **Icons** | Lucide React | Clean, scalable vector iconography |
| **Authentication** | `jose` (JWT) and `bcryptjs` | Signed JWT session cookies and secure password hashing |

---

## System Architecture and Portals

The application enforces strict domain isolation across three specialized role-based portals:

### 1. Clinical Doctor Portal (`/doctor/*`)
Designed for attending physicians, surgeons, and specialists:
- **Patient Rosters**: Comprehensive directory of assigned inpatients and outpatients with active diagnoses and allergy alerts.
- **Biometric Vitals Recording**: Time-series capture and graphing of blood pressure, pulse rate, SpO2 blood oxygen, body temperature, and respiration rate.
- **Surgical Scheduling**: Schedule surgical procedures, assign operating rooms (OR-1 through OR-4), document surgical teams, and track intra-operative progress.
- **Electronic Prescribing**: Formulate prescriptions with precise dosage, administration route, frequency, and duration with automated routing to the hospital pharmacy.
- **Diagnostic Laboratory Orders**: Requisition lab panels (CMP, CBC, Lipid Panels, Cardiac Troponins) and review verified pathologist findings.
- **Departmental Patient Transfers**: Coordinate inter-departmental transfers across ICU, Cardiology, Oncology, Surgery, and General wards.

### 2. Patient Health Portal (`/patient/*`)
Designed for patient self-service and digital health records:
- **Clinical Health Summary**: Overview of assigned primary physicians, active care plans, and upcoming consultations.
- **Digital Prescription Wallet**: Review current medications, dosage instructions, prescribing doctor information, and refill schedules.
- **Biometric Vitals History**: Longitudinal historical logs of vital signs with interactive trend visualization.
- **Laboratory Results**: Verified diagnostic laboratory reports with normal reference ranges and doctor recommendations.
- **Surgical and Procedure History**: Post-operative care guidelines, discharge summaries, and recovery milestones.
- **Profile and Credentials Management**: Contact updates and secure password management.

### 3. Enterprise Administrator Portal (`/admin/*`)
Designed for hospital operations directors and executive management:
- **Departmental Staff Payroll**: Monthly salary processing, tax deductions, clinical allowances, and payment voucher generation.
- **Pharmacy Stock Management**: SKU tracking, batch identification, unit pricing, real-time stock levels, and expiration alerts.
- **Hospital Assets and Equipment**: Lifecycle management for high-value medical devices (MRI machines, ventilators, infusion pumps, defibrillators) including maintenance logs and warranty tracking.
- **Doctor and Patient Accounts**: Staff credentialing, licensing verification, department assignments, and patient registration.
- **Vendor and Supplier Relations**: Contract records, distributor contact details, and supply category management.
- **System Telemetry and Audit Logs**: Oracle transaction latency monitoring, session access logs, and security audit trails.

---

## Interactive 3D Interface and Live Clinical Telemetry

### 3D Robotic Assistant Interface
The landing page incorporates an interactive 3D WebGL medical android integrated via `@splinetool/react-spline` and Framer Motion:
- **Global Cursor Tracking**: An optimized `requestAnimationFrame` pointer listener on the browser window forwards mouse coordinates to the Spline canvas regardless of cursor position, ensuring responsive tracking across the entire viewport.
- **Spring Parallax Physics**: The container applies subtle 3D perspective rotation (`rotateY`, `rotateX`) responding to cursor offset with zero layout shift.
- **Smooth Loading Lifecycle**: Double-buffered WebGL texture loading prevents initial blank render flashes with a smooth ease-in opacity transition.

### Dedicated Clinical Telemetry Command Center
Directly underneath the hero section, a dedicated operational telemetry dashboard displays live data streams:
- **Continuous Vitals Stream**: Heart pulse (72 BPM with animated SVG ECG rhythm), SpO2 (98%), Blood Pressure (120/80 mmHg), and Body Temp (98.6 deg F).
- **Physician Queue**: Live consultation status, operating room status (Angioplasty in OR-2), and scheduled appointments.
- **Oracle Database Metrics**: Active table synchronization, pharmacy fulfillment rates, and ACID commit latencies (18ms).

---

## Relational Database Architecture (Oracle 19c)

### Schema Design and Normalization
The database schema is designed in Third Normal Form (3NF) to eliminate transitive dependencies, ensure referential integrity, and maximize query performance across clinical workflows.

```
+----------------+       +-------------------+       +---------------+
|  HIS_PATIENTS  |----<  | HIS_APPOINTMENTS  |  >----|   HIS_DOCS    |
+----------------+       +-------------------+       +---------------+
        |                          |                         |
        |---< HIS_VITALS           |---< HIS_SURGERY         |---< HIS_PAYROLLS
        |---< HIS_LABORATORY       |---< HIS_TRANSFERS       |
        >---< HIS_PRESCRIPTONS >---+---< HIS_PHARMACEUTICALS
```

### Complete Table Dictionary (22 Tables)

| # | Table Name | Primary Key | Description |
| :--- | :--- | :--- | :--- |
| 1 | `HIS_ADMIN` | `AD_ID` | Hospital executive administrators and access credentials |
| 2 | `HIS_DOCS` | `DOC_ID` | Clinical physicians, specialty departments, licensing numbers |
| 3 | `HIS_PATIENTS` | `PAT_ID` | Registered patient demographics, contact details, medical history |
| 4 | `HIS_VITALS` | `VIT_ID` | Time-series patient biometric readings (BP, pulse, SpO2, temp) |
| 5 | `HIS_PRESCRIPTONS` | `PRES_ID` | Physician prescription records, clinical dosages, duration |
| 6 | `HIS_PHARMACEUTICALS` | `PHAR_ID` | Medicine inventory, batch tracking, stock counts, pricing |
| 7 | `HIS_PHARMACEUTICALS_CATEGORY` | `PHAR_CAT_ID` | Drug classifications and pharmaceutical categories |
| 8 | `HIS_LABORATORY` | `LAB_ID` | Diagnostic lab test orders, specimen records, pathologist findings |
| 9 | `HIS_SURGERY` | `SURG_ID` | Operating room scheduling, surgical teams, operative logs |
| 10 | `HIS_PATIENT_TRANSFERS` | `T_ID` | Inter-departmental patient movement and transfer approvals |
| 11 | `HIS_MEDICAL_RECORDS` | `MDR_ID` | Longitudinal patient clinical consultation documentation |
| 12 | `HIS_PAYROLLS` | `PAY_ID` | Staff monthly salary disbursals, deductions, allowances |
| 13 | `HIS_EQUIPMENTS` | `EQ_ID` | Medical devices, ventilators, monitors, maintenance logs |
| 14 | `HIS_ASSETS` | `AS_ID` | Hospital physical infrastructure assets and valuations |
| 15 | `HIS_ACCOUNTS` | `ACC_ID` | Financial ledger, billing records, operational revenue |
| 16 | `HIS_VENDOR` | `V_ID` | Pharmaceutical suppliers, equipment vendors, contact records |
| 17 | `HIS_USER_ACCOUNTS` | `USER_ID` | Unified multi-tenant authentication credentials and hashes |
| 18 | `HIS_ROLES` | `ROLE_ID` | RBAC role definitions (Admin, Doctor, Patient) |
| 19 | `HIS_PRIVILEGES` | `PRIV_ID` | Fine-grained system permissions |
| 20 | `HIS_ROLE_PRIVILEGES` | `RP_ID` | Mapping table connecting roles to system privileges |
| 21 | `HIS_USER_ROLES` | `UR_ID` | Mapping table connecting user accounts to specific roles |
| 22 | `HIS_PWDRESETS` | `ID` | Password reset tokens and expiration tracking |

### Database Sequences and Automated Triggers
Every primary table utilizes a dedicated Oracle sequence (`HIS_*_SEQ`) coupled with a `BEFORE INSERT` trigger to guarantee gapless, collision-free auto-incrementing identifiers without client-side coordination.

### Materialized Views and Aggregations
Pre-aggregated views accelerate dashboard queries:
- `V_PATIENT_SUMMARY`: Consolidates patient demographics with their latest vitals and active prescription counts.
- `V_DOCTOR_SCHEDULE`: Aggregates active patient consultations, upcoming surgeries, and pending lab orders for each physician.
- `V_PHARMACY_STOCK_ALERTS`: Filters medicines with quantities below threshold or approaching expiration within 60 days.
- `V_PATIENT_TRANSFERS`: Joined view showing source department, destination department, patient name, and transferring physician.

---

## Security and Access Control Architecture

1. **Cryptographic JWT Session Cookies**:
   - Authentication tokens are generated using `jose` with HS256 encryption.
   - Tokens are delivered exclusively via HTTP-only, SameSite=Strict, Secure cookies (`session`), preventing client-side JavaScript access and mitigating XSS/CSRF vectors.

2. **Inactivity Session Invalidation**:
   - Both client-side activity listeners and server middleware enforce a strict 15-minute inactivity timeout.
   - Prolonged idle sessions are automatically destroyed and redirected to the login gateway.

3. **Parameterized SQL Query Execution**:
   - All queries executed through `lib/db.js` use strict parameterized bind variables (`:bind_var`), entirely eliminating SQL injection vulnerabilities.

4. **Role-Based Route Guards (RBAC)**:
   - Next.js middleware inspects session claims on every incoming request.
   - Users attempting to access portals outside their assigned role are redirected to `/unauthorized`.

5. **Automated Demo Deletion Protection**:
   - All destructive database operations (HTTP `DELETE`) are filtered by a security guard.
   - Requests initiated by demo accounts (`demo.*`) are safely rejected with descriptive alerts, preventing database corruption by public evaluators.

---

## API Route Directory

The platform provides 46 API route handlers organized by clinical and operational domain:

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

For evaluation and demonstration purposes, pre-configured accounts are available on the login screen (`/login`):

| Role | Demo Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `demo.admin@curewell.com` | `demo123` | Full administrative operations, payroll, inventory, assets |
| **Doctor** | `demo.doctor@curewell.com` | `demo123` | Patient rosters, vitals charting, surgeries, prescriptions |
| **Patient** | `demo.patient@curewell.com` | `demo123` | Personal health records, lab results, digital prescriptions |

### Demo Protection Guard
To ensure uninterrupted demonstration quality for all evaluators, all `DELETE` endpoints intercept operations from `demo.*` accounts and return HTTP 403 Forbidden with a user-friendly explanation. Demo users retain full freedom to create and modify records across all three portals.

---

## Installation and Environment Configuration

### Prerequisites
- Node.js 18.17.0+ or Node.js 20.x
- Oracle Database 19c (or Oracle XE 21c / Oracle Cloud Autonomous DB)
- Oracle Instant Client (if thick mode connection is required)

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
Execute the SQL scripts in order using Oracle SQL Developer or SQL*Plus:
```sql
@database/01_SCHEMA_PROJECT_CREATE.sql
@database/02_SCHEMA_PROJECT_INSERT_PART1.sql
@database/03_SCHEMA_PROJECT_INSERT_PART2.sql
@database/04_SEED_DEMO_CLINICAL_DATA.sql
```

### Step 4: Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Oracle Database Credentials
DB_USER=SCHEMA_PROJECT
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1

# JWT Secret for Session Cookie Signing
JWT_SECRET=your_long_cryptographically_secure_random_key_here

# Optional: Path to Oracle client libraries for thick mode
# ORACLE_LIB_DIR=C:\oracle\instantclient_19_8
```

### Step 5: Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

---

## Available Scripts

- `npm run dev` - Launches Next.js in development mode with Turbopack fast refresh.
- `npm run build` - Compiles the application and generates the production build.
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
│   ├── page.tsx                    # Landing page with 3D Robot & Live Telemetry
│   └── unauthorized/               # Access control violation fallback page
├── components/
│   ├── ui/                         # Reusable UI primitives (buttons, dialogs, spline)
│   │   └── spline.tsx              # Full-bleed 3D Spline scene component
│   └── shared/                     # Cross-portal navigational headers & sidebars
├── database/                       # Oracle 19c 3NF SQL schema and seed scripts
├── hooks/                          # Custom React hooks (inactivity timeout, media queries)
├── lib/
│   ├── auth.ts                     # JWT signing, verification, and cookie utilities
│   ├── db.js                       # Oracle connection pool wrapper with parameterized binds
│   └── utils.ts                    # Class name mergers and formatting helpers
├── middleware.ts                   # Role-based route guard and session validator
├── package.json                    # Project dependencies and npm scripts
└── README.md                       # Comprehensive platform documentation
```

---

## Author and Maintainer

- **Nobody243** (`01-135232-062@student.bahria.ed.pk`)
- GitHub Repository: [Nobody243/Modern-Healthcare-Management-System](https://github.com/Nobody243/Modern-Healthcare-Management-System)
