# 🗂️ Task Manager Application

A modern **Firebase-powered Task Manager** built using **React + Vite**, featuring secure authentication, email verification, a visual Kanban-style task board, real-time updates, protected routes, and full test coverage.

---

## 🚀 Live Demo
> https://task-manager-57e3c.web.app

## Strucuture 
src/
├── components/
│   ├── Button.jsx
│   ├── InputField.jsx
│   ├── TaskCard.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── TaskContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── TaskBoard.jsx
├── tests/
│   ├── Button.test.jsx
│   ├── InputField.test.jsx
│   ├── FullFlow.test.jsx
├── firebase.js
└── App.jsx


## 🔐 Authentication (Firebase Auth)

### Features
- Email & Password Signup
- Email Verification Required
- Login allowed **only after email verification**
- Centralized error handling for auth flows
- Secure Logout

### Flow
1. User signs up with email & password
2. Firebase sends verification email
3. User verifies email
4. Only verified users can log in
5. Unverified users see resend verification option

---

## 🔒 Route Protection

- Dashboard & Task Board are **protected routes**
- Users **cannot access** private pages without authentication
- Unauthenticated users are redirected to Login
- Verified email is required to proceed

---

## 📊 Dashboard

The Dashboard provides a complete overview of user productivity.

### Dashboard Features
- **Empty State UI** (shown for new users with no tasks)
- Task Statistics:
  - Total Tasks
  - In Progress Tasks
  - Completed Tasks
  - Tasks Created Today
  - Tasks Deleted Today
  - Total Deleted Tasks
- **Circular Chart Visualization**
- **Recent Activity Panel**
  - Shows last **4 recently updated tasks**
  - Displays task title and status

---

## 🧩 My Task Board (Kanban Board)

A Canva-style task board for managing tasks visually.

### Columns
- **To Do**
- **In Progress**
- **Done**

### Board Capabilities
- Create new tasks directly in the **To Do** column
- Edit existing tasks
- Drag & drop tasks between columns
- Real-time updates via Firestore
- Tasks persist across sessions

---

## 🧠 Global State Management

### AuthContext
- Handles authentication state
- Manages login, signup, logout
- Tracks verified user status

### TaskContext
- Manages all task-related data
- Real-time Firestore listeners
- Global loading & task state
- Auto cleanup on logout

---

## 🧱 Reusable Components

### Components Included
- **Button Component**
  - Multiple variants
  - Loading states
- **InputField Component**
  - Floating labels
  - Password visibility toggle
  - Validation handling
- **TaskCard Component**
  - Drag & drop enabled
  - Task status display

All components are modular and reusable.

---

## 🔥 Firebase Integration

### Firebase Services Used
- Firebase Authentication
- Firestore Database
- Email Verification
- Real-time listeners

Firebase logic is separated for easy testing and scalability.

---

## 🧪 Testing (Vitest)

The project includes **unit and integration tests**.

### Tests Included
- Button component tests
- InputField component tests
- Full flow integration test:
  - Dashboard render
  - Task creation flow

### Run Tests
```bash
npx vitest --watch
