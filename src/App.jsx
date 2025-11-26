import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MyTasksPage from "./pages/MyTasksPage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import toast from "react-hot-toast";

function App() {
  const { user, loading } = useAuth();

   useEffect(() => {
    if (!user) return; // only after login

    const requestPermission = async () => {
      console.log("⏳ Asking for notification permission...");
      
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("❌ Notifications blocked by user");
        return;
      }

      // Get FCM Token
      try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

        const token = await getToken(messaging, { vapidKey });

        if (token) {
          console.log("✅ FCM Token:", token);
          toast.success("Notifications enabled!");
        } else {
          console.log("⚠️ No token generated");
        }

      } catch (error) {
        console.error("Token Error:", error);
      }
    };

    requestPermission();

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log("📩 FCM Message Received:", payload);
      toast(payload.notification?.title || "New Notification");
    });

  }, [user]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "white",
            color: "#090979",
            fontWeight: 500,
            borderRadius: "10px",
            boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
          },
        }}
      />

      <Routes>
  {/* If no user → show login/signup */}
  {!user && (
    <Route path="/" element={<AuthPage />} />
  )}

  {/* If logged in but NOT verified → send back to login */}
  {user && !user.emailVerified && (
    <>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )}

  {/* If verified user → allow dashboard */}
  {user && user.emailVerified && (
    <>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/my-tasks" element={<MyTasksPage />} />
    </>
  )}

  {/* Catch all unknown routes */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

    </Router>
  );
}

export default App;
