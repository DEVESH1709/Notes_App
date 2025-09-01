# Notes App

A full-stack notes application with OTP authentication and Google login.

---

## Features

- User signup/signin with OTP verification
- Google login
- Create, view, and manage notes
- Responsive UI (React + Vite)
- Secure backend (Node.js + Express + MongoDB)

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)
- Gmail account for sending OTP emails

---

## Folder Structure

```
/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── notes/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
```

---

## 1. Backend Setup

### A. Configure Environment Variables

Create `backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
```

### B. Install Dependencies

```bash
cd backend
npm install
```

### C. Build and Run

```bash
npm run build
npm start
```

---

## 2. Frontend Setup

### A. Configure Environment Variables

Create `notes/.env`:

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### B. Install Dependencies

```bash
cd notes
npm install
```

### C. Run Frontend

```bash
npm run dev
```

---

## 3. Production Build & Deployment

### A. Build Frontend

```bash
cd notes
npm run build
```

### B. Serve Frontend from Backend (Optional)

Copy the build output to the backend (if serving from Express):

```bash
cp -r notes/dist/* backend/dist/public/
```

Update backend `index.ts` to serve static files from `dist/public`.

### C. Deploy

- Deploy both `backend` and `notes` folders to your cloud provider (e.g., Render, Vercel).
- Update `.env` files with production URLs and credentials.

---

## 4. Usage

- Visit the frontend URL.
- Sign up or sign in with email OTP or Google.
- Create and manage your notes.

---

## Troubleshooting

- **Network Error:** Check API URLs and CORS settings.
- **Email issues:** Verify Gmail app password and service.
- **Build errors:** Ensure all dependencies are installed and TypeScript configs are correct.

---
