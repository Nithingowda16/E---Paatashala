# AI-Powered NxtWave Online Learning Management System (LMS)

A complete, production-grade **Virtual Classroom & Learning Management Platform** inspired by Google Classroom and Google Material Design 3. Built with **Node.js, Express, MongoDB Atlas / Mongoose, React, Vite, Socket.IO, WebRTC, Multer, and the Google Gemini API**.

---

## 🌟 Architecture & Features

1. **Google Material Design 3 UI & Responsive Design**:
   - Google Sans / Outfit typography, Google product colors (`#1a73e8`, `#34a853`, `#fbbc04`, `#ea4335`).
   - Dark Mode / Light Mode support with custom design tokens (`theme.css`).
   - Skeleton loaders, dialog modals, snackbar notifications, and glassmorphic badges.

2. **Role-Based Access Control (RBAC)**:
   - **ADMIN**: System statistics, user status controls (Activate/Suspend), upload storage analytics, audit trail logs.
   - **TEACHER**: Classroom creation & management, unique code generation (`CS-AI-7X92`), announcement scheduling, study material uploads, assignment creation, student submission review & gradebook returning, attendance window control, live WebRTC meeting hosting.
   - **STUDENT**: Classroom enrollment via code, priority engine dashboard (Due Today, Live Now, Attendance Open), assignment submission, attendance tracking, WebRTC meeting participation, direct teacher messaging.

3. **8-Tab Classroom Hub**:
   - **Stream**: Activity feed, announcements, author avatars, comments.
   - **Classwork**: Units/Topics, study materials (PDF/Doc notes), assignments.
   - **People**: Teacher & student rosters, academic attendance %, assignment completion.
   - **Attendance**: Authoritative server timestamp validation, active window alert, "Mark Present" button.
   - **Live Classes**: Scheduled meetings, "Join WebRTC Room" CTA.
   - **Chat**: Real-time Socket.IO room chat with typing indicators and attachments.
   - **Grades**: Teacher Gradebook matrix & student performance summary.
   - **Gemini AI**: Contextual assistant tailored to classroom materials.

4. **WebRTC Live Classes & Automated Participation Attendance**:
   - Integrated audio/video calling, host controls (mute, end meeting), screen sharing, raise hand status, call chat.
   - Automated participation duration calculation on backend: marks attendance (`PRESENT` / `LATE` / `ABSENT`) based on minimum attendance threshold (e.g. >= 75%).

5. **Integrated Gemini AI Assistant**:
   - SDK integration with fallback educational model.
   - Student tools: Concept explanation, note summarization, quiz question generation, revision schedule creation.
   - Teacher tools: Draft assignment questions, lesson plans, announcements, rubrics.
   - Stored multi-turn AI chat conversation history.

6. **Centralized Notification & Background Cron Scheduler**:
   - Assignment deadline reminders (24h, 1h before), meeting alerts, attendance open warnings, scheduled post publishing.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Development Database
```bash
npm run seed
```
*Seeds default teacher (`ananya@school.edu` / `password123`), students (`sai@school.edu` / `password123`), admin (`admin@school.edu` / `adminpassword123`), sample classes, assignments, and materials.*

### 3. Start Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST Server**: `http://localhost:5000`

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite 5, Lucide Icons, Recharts, Socket.IO Client, CSS3 (Material 3).
- **Backend**: Node.js, Express.js, Mongoose, Socket.IO 4, JWT, BcryptJS, Multer, Node-Cron, `@google/genai`.
- **Database**: MongoDB (Mongoose Schema ORM).
- **Real-Time**: Socket.IO & WebRTC Signaling.
