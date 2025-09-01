# Notes App

A full-stack notes application with OTP authentication, Google login, and note management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Running the App Locally](#4-running-the-app-locally)
  - [5. Production Build & Deployment](#5-production-build--deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- User registration and login via OTP (email-based)
- Google OAuth login
- Create, view, and delete notes
- Responsive UI with React and Tailwind CSS
- Secure backend with JWT authentication
- Email notifications for OTP

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Auth:** JWT, Google OAuth
- **Email:** Nodemailer (Gmail)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/DEVESH1709/Notes_App.git
cd Notes_App
```

---

### 2. Backend Setup

#### a. Configure Environment Variables

Create a `.env` file in the `backend` folder:

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

#### b. Install Dependencies

```bash
cd backend
npm install
```

#### c. Build and Run Backend

```bash
npm run build
npm start
```

The backend will start on `http://localhost:5000` by default.

---

### 3. Frontend Setup

#### a. Configure Environment Variables

Create a `.env` file in the `notes` folder:

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### b. Install Dependencies

```bash
cd notes
npm install
```

#### c. Run Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` by default.

---

### 4. Running the App Locally

- Start the backend (`npm start` in `backend`)
- Start the frontend (`npm run dev` in `notes`)
- Open `http://localhost:5173` in your browser

---

### 5. Production Build & Deployment

#### a. Build Frontend

```bash
cd notes
npm run build
```

#### b. Deploy

- Deploy both `backend` and `notes` folders to your cloud provider (e.g., Render, Vercel).
- Update `.env` files with production URLs and credentials.

---

## Environment Variables

### Backend (`backend/.env`)

- `MONGO_URI`: MongoDB connection string
- `EMAIL_SERVICE`: Email service (e.g., gmail)
- `EMAIL_USER`: Gmail address
- `EMAIL_PASS`: Gmail app password
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRES_IN`: JWT expiration (e.g., 1h)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `FRONTEND_URL`: Frontend URL (for CORS)

### Frontend (`notes/.env`)

- `VITE_API_URL`: Backend API URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

---

## Troubleshooting

- **Network Error:**  
  - Check that `VITE_API_URL` matches your backend deployment URL.
  - Ensure CORS is configured correctly in the backend.

- **Email Issues:**  
  - Verify Gmail app password and email settings.

- **Build Errors:**  
  - Ensure all dependencies are installed.
  - Make sure `@types/node` is in `devDependencies` and `"types": ["node"]` is in `tsconfig.json`.

- **404 Errors:**  
  - Ensure API routes are defined and mounted correctly.

---
