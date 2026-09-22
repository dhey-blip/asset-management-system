# Asset Management System

A simple web-based Asset Management System built as a technical assessment project. It demonstrates authentication, full CRUD, RESTful API design, and a basic report — using React, Express, and Microsoft SQL Server.

**Version:** 1.0.0
**Developer:** Dan Rhei S. Francisco
**Copyright:** © 2026 Dan Rhei S. Francisco

---

## Description

The system lets an authorized user log in, manage a list of company assets (add, view, edit, delete, search, filter), see summary statistics on a dashboard, and generate a printable asset report. It follows a standard three-tier architecture: a React frontend calls a REST API built with Express, which is the only layer that talks to SQL Server.

```
React (Vite + Ant Design)
        ↓  REST API (JSON)
ExpressJS (Node.js)
        ↓  Parameterized queries
Microsoft SQL Server
```

## Features

- Secure login with hashed passwords and JWT-based sessions
- Full CRUD on assets (create, read, update, delete)
- Search by asset code/name and filter by status
- Dashboard with live summary statistics (Total, Available, Assigned, Maintenance)
- Printable asset report
- Responsive layout (desktop, tablet, mobile)
- Input validation on both frontend and backend
- Parameterized SQL queries (no string-concatenated SQL)

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Ant Design, React Router, Axios |
| Backend | Node.js, Express |
| Database | Microsoft SQL Server |
| Auth | bcryptjs (password hashing), jsonwebtoken (JWT) |
| Version Control | Git, GitHub |

## System Requirements

- Node.js v20.19+ or v22+ (LTS recommended)
- npm (bundled with Node.js)
- Microsoft SQL Server 2019+ (or SQL Server Express)
- SQL Server Management Studio (SSMS) — recommended for running schema/seed scripts
- Git
- A modern browser: Chrome, Edge, or Firefox

## Project Structure

```
asset-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Request handling + validation
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Database queries
│   │   ├── utils/           # hashPassword.js helper
│   │   └── server.js        # App entry point
│   ├── .env                 # Local secrets (not committed)
│   ├── .env.example         # Template for .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # ProtectedRoute, AssetFormModal
│   │   ├── layouts/         # MainLayout (sidebar + header)
│   │   ├── pages/           # Login, Dashboard, Assets, Reports
│   │   ├── services/        # api.js, authService.js, assetService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └──.gitignore
│   └──eslint.config.js
│   └──index.html
│   └──package-lock.json
│   └── package.json
├── database/
│   ├── schema.sql           # Creates Users and Assets tables
│   └── seed.sql             # Test account + sample assets
├── .gitignore
└── README.md
```

## Database Setup

1. Open SSMS and connect to your SQL Server instance.
2. Open and execute `database/schema.sql`. This creates the `AssetManagementDB` database and the `Users` and `Assets` tables, with a unique constraint on `AssetCode` and a check constraint on `Status`.
3. Open and execute `database/seed.sql`. This inserts a test `admin` user and five sample assets.

   > `seed.sql` ships with a placeholder password hash. To log in, generate a real one (see [Test Account](#test-account) below) and update the `Users` row before continuing.

4. Verify:
   ```sql
   USE AssetManagementDB;
   SELECT * FROM dbo.Users;
   SELECT * FROM dbo.Assets;
   ```

### SQL Server prerequisites

- **Mixed authentication mode** must be enabled (Server Properties → Security → "SQL Server and Windows Authentication mode"), with a service restart afterward.
- **TCP/IP must be enabled** on port 1433 (SQL Server Configuration Manager → SQL Server Network Configuration → Protocols), with a service restart afterward. Verify with:
  ```powershell
  Test-NetConnection localhost -Port 1433
  ```
  `TcpTestSucceeded : True` confirms it's reachable.
- A dedicated SQL login (not `sa`) is used by the app, scoped to `db_owner` on `AssetManagementDB` only:
  ```sql
  CREATE LOGIN asset_app WITH PASSWORD = 'YourStrongPassword123!';
  USE AssetManagementDB;
  CREATE USER asset_app FOR LOGIN asset_app;
  ALTER ROLE db_owner ADD MEMBER asset_app;
  ```

## Backend Installation

```bash
cd backend
npm install
```

Installs Express, cors, dotenv, mssql, bcryptjs, and jsonwebtoken.

## Frontend Installation

```bash
cd frontend
npm install
```

Installs React, Vite, Ant Design, React Router, and Axios.

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in real values. **Never commit `.env`.**

```
PORT=5000
CLIENT_URL=http://localhost:5173

DB_SERVER=localhost
DB_PORT=1433
DB_NAME=AssetManagementDB
DB_USER=asset_app
DB_PASSWORD=your_password_here
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=8h
```

Generate a strong `JWT_SECRET`:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The frontend has no `.env` — it connects to `http://localhost:5000/api`, configured directly in `frontend/src/services/api.js`.

## How to Run

Run the backend and frontend in **two separate terminals**, both need to be running at the same time.

**Terminal 1 — backend:**
```bash
cd backend
npm run dev
```
Expected output:
```
Server running on http://localhost:5000
Connected to SQL Server database: AssetManagementDB
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Expected output includes:
```
Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

## Test Account

Generate a bcrypt hash for a password of your choice:
```bash
cd backend
node src/utils/hashPassword.js YourChosenPassword
```

Update the seeded admin user with the generated hash:
```sql
USE AssetManagementDB;
UPDATE dbo.Users
SET PasswordHash = '<paste generated hash>'
WHERE Username = 'admin';
```

Log in with:
- **Username:** `admin`
- **Password:** whatever you chose above

## API Endpoints

All `/api/assets` routes require an `Authorization: Bearer <token>` header, obtained from `/api/auth/login`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/:id` | Get a single asset |
| POST | `/api/assets` | Create a new asset |
| PUT | `/api/assets/:id` | Update an existing asset |
| DELETE | `/api/assets/:id` | Delete an asset |
| GET | `/api/health` | API health check (no auth required) |
| GET | `/api/health/db` | Database connection check (no auth required) |

All responses follow the shape:
```json
{ "success": true, "message": "...", "data": { } }
```

### Status codes used

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request (validation failure, duplicate code) |
| 401 | Unauthorized (missing/invalid/expired token, bad login) |
| 404 | Resource not found |
| 500 | Server error |

## CRUD Testing

1. Log in with the test account above.
2. **Create:** go to **Assets → Add Asset**, fill in a unique Asset Code and Asset Name, submit. Confirm the new row appears in the table.
3. **Read:** confirm the assets table loads existing data on page load; use the search box and status filter to narrow results.
4. **Update:** click **Edit** on any row, change the Status or other fields, save. Confirm the row updates in place. Try typing a name into "Assigned To" — Status should switch to "Assigned" automatically.
5. **Delete:** click **Delete** on a row, confirm via the popup, confirm the row disappears.
6. **Validation:** try submitting Add Asset with empty required fields (should show inline errors) and with a duplicate Asset Code (should show a server-side error message).

Backend validation can also be tested directly, bypassing the UI:
```powershell
$login = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body (@{ username = "admin"; password = "YourChosenPassword" } | ConvertTo-Json) -ContentType "application/json"
$headers = @{ Authorization = "Bearer $($login.data.token)" }
Invoke-RestMethod -Uri http://localhost:5000/api/assets -Method Get -Headers $headers
```

## Report Testing

1. Log in, click **Reports** in the sidebar.
2. Confirm the four summary numbers match the Dashboard's numbers (both read from the same data).
3. Confirm the full asset table displays (no pagination).
4. Click **Print Report** and confirm the print preview hides the sidebar/header and shows a report title with a generated timestamp.

## Responsive Testing

Tested using browser DevTools device emulation at:

| Device | Resolution | Expected behavior |
|---|---|---|
| Desktop | 1920×1080 | Full sidebar, 4-column dashboard cards, full table |
| Laptop | 1366×768 | Same as desktop |
| Tablet | 768×1024 | Sidebar auto-collapses, cards remain readable |
| Mobile | 390×844 | Collapsed sidebar, 2-column cards, table scrolls horizontally, no page-level horizontal overflow |

Also manually verified in Chrome, Edge, and Firefox.

## Challenges Encountered

- **PowerShell script execution disabled.** Running `npm` commands initially failed with a "running scripts is disabled on this system" error. Fixed with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **SQL Server connection refused from Node.** The `mssql` package couldn't reach SQL Server until TCP/IP was explicitly enabled and given a fixed port (1433) in SQL Server Configuration Manager, followed by a service restart.
- **Typo in a service filename** (`assetsService.js` vs `assetService.js`) caused the backend to crash on startup with a module-not-found style error. A reminder that `require()` paths must match filenames exactly.
- **Forgot to start the backend server** before testing the frontend, producing `ERR_CONNECTION_REFUSED` in the browser. Both `npm run dev` processes (frontend and backend) need to run simultaneously, in separate terminals, for the whole app to work.
- **React `useEffect` exhaustive-deps warning.** Calling an outer function from inside `useEffect(() => {...}, [])` triggered an ESLint warning about a missing dependency. Resolved by moving the fetch function's definition inside the effect itself.
- **Ant Design `Statistic` `valueStyle` deprecation warning.** Newer Ant Design versions prefer `styles={{ content: {...} }}` over `valueStyle` for custom coloring; updated across the Dashboard and Reports cards.
- **Assigned To / Status could get out of sync.** Editing an asset's "Assigned To" field didn't automatically update its Status, allowing a contradictory state (a named assignee with Status still "Available"). Fixed by syncing Status to "Assigned" automatically when "Assigned To" has a value, and back to "Available" when cleared (without overriding a manually chosen "Maintenance" status).
- **Expired/invalid JWT left the UI in a broken state** instead of redirecting to login. Fixed by having the Axios response interceptor force a redirect to `/login` on any `401` response.

## Developer

**Dan Rhei S. Francisco**
Asset Management System — v1.0.0
© 2026 Dan Rhei S. Francisco