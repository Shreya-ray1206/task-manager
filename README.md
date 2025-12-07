# Task Manager – React + Firebase + Tailwind

## 📋 Project Overview
A responsive task management web app built with React (Vite), Firebase, and Tailwind CSS. Users can create, edit, and organize tasks into To Do, In Progress, and Done columns — with drag-and-drop on web and a status dropdown for mobile.

## 🚀 Tech Stack
### Frontend
- **React** + **Vite** + **Tailwind CSS**

### Backend
- **Firebase** (Auth + Firestore)

### UI Features
- Responsive design with reusable components
- Mobile-friendly interface
- Real-time updates

## 📁 Project Structure
```
src/
├── components/
│   ├── Button.jsx           # Reusable button component
│   ├── InputField.jsx       # Reusable input component with validation
│   ├── LoginForm.jsx        # Login form with email verification
│   ├── SignupForm.jsx       # Signup form with validation
│   ├── TaskCard.jsx         # Individual task component
│   ├── MyTasksBoard.jsx     # Main task board with columns
│   ├── DashboardContent.jsx # Dashboard analytics
│   └── Sidebar.jsx          # Navigation sidebar
├── pages/
│   ├── AuthPage.jsx         # Authentication page
│   ├── DashboardPage.jsx    # Dashboard page
│   └── MyTasksPage.jsx      # Tasks management page
├── context/
│   ├── AuthContext.js       # Authentication context
│   ├── AuthProvider.jsx     # Auth state provider
│   ├── TaskContext.js       # Tasks context
│   └── TaskProvider.jsx     # Tasks state provider
├── utils/
│   └── error.js             # Firebase error handling utilities
├── firebase/
│   └── index.js             # Firebase configuration
├── App.jsx                  # Main application component
└── main.jsx                 # Application entry point
```

## 🧩 Reusable Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Button.jsx** | Customizable button used across the app. | Variants (primary, icon), responsive, hover animations. |
| **InputField.jsx** | Reusable input field for forms and tasks. | Supports labels, multiline input, and validation. |
| **TaskCard.jsx** | Displays each task with status, edit, and delete actions. | Responsive layout, dropdown for status, smooth UI transitions. |
| **MyTasksBoard.jsx** | Manages and displays task columns. | Drag-and-drop (web), adaptive design for mobile. |

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase:**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Copy your Firebase config

4. **Create `.env` file:**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Integration

### Authentication
- Email/Password authentication with verification
- Protected routes based on auth status
- Session management

### Database Structure
```javascript
users/{userId}:
  - fullName: string
  - email: string
  - createdAt: timestamp

users/{userId}/tasks/{taskId}:
  - title: string
  - description: string
  - status: "todo" | "inProgress" | "done"
  - priority: "high" | "medium" | "low"
  - createdAt: timestamp
  - updatedAt: timestamp
  - deleted: boolean
```

### Real-time Features
- Live task updates using Firestore listeners
- Instant status changes across devices
- Dashboard statistics in real-time

## 📱 Features

### Authentication
- **Login/Logout**: Secure authentication flow
- **Email Verification**: Mandatory before accessing dashboard
- **Password Reset**: Built-in recovery options
- **Form Validation**: Client-side validation with helpful error messages

### Task Management
- **Create Tasks**: Add tasks with title, description, and priority
- **Edit Tasks**: Update task details inline
- **Delete Tasks**: Soft delete with confirmation
- **Drag & Drop**: Move tasks between columns (desktop)
- **Status Change**: Update task status via dropdown (mobile)
- **Priority Levels**: High, Medium, Low with color coding

### Dashboard
- **Task Statistics**: Total, completed, and in-progress counts
- **Recent Tasks**: View recently updated tasks, lastest top 3 
- **Visual Analytics**: Gradient cards with progress indicators

### User Interface
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Mode**: Theme switching support
- **Animations**: Smooth transitions and hover effects
- **Notifications**: Toast notifications for user actions

## 🎨 Styling System

### Colors
```css
Primary: from-[#090979] to-[#27AECC]
Background: from-[#89BAFA] to-[#FAB0FF]
Task Columns:
  - Todo: from-[#6A11CB] to-[#2575FC]
  - In Progress: from-[#FF9966] to-[#FF5E62]
  - Done: from-[#00c6ff] to-[#0072ff]
```

### Responsive Design
- **Mobile**: < 640px (single column layout)
- **Tablet**: 640px - 1024px (adaptive columns)
- **Desktop**: > 1024px (three-column layout with drag-and-drop)

## 📖 Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Verify Email**: Check your inbox for verification link
3. **Login**: Access your dashboard
4. **Create Tasks**: Start adding and organizing tasks

### Managing Tasks
1. **Add Task**: Click "+ Create New Task" in To Do column
2. **Edit Task**: Click edit icon on any task card
3. **Move Task**: Drag between columns or use status dropdown
4. **Delete Task**: Click trash icon (moves to archive)

### Dashboard Features
- View task statistics at a glance
- Monitor progress with visual indicators
- Access recently updated tasks quickly

## 🔒 Security Features
- Email verification required
- Password strength enforcement
- Protected API routes
- User data isolation
- Secure Firebase rules

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
1. **Firebase Hosting:**
   ```bash
   firebase init hosting
   firebase deploy
   ```

2. **Vercel:**
   ```bash
   vercel
   ```

3. **Netlify:**
   ```bash
   netlify deploy
   ```

## 🧪 Testing
Run the test suite:
```bash
npm test
```



### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/logout` - User logout
- `POST /api/verify-email` - Email verification

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- Shreya Ray

## 🙏 Acknowledgments
- Firebase team for amazing backend services
- React team for the fantastic frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors who helped shape this project

## 📧 Contact

Project Link: [https://github.com/yourusername/task-manager](https://github.com/yourusername/task-manager)

## ⭐ Show your support
Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Firebase, and Tailwind CSS**