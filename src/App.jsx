import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MyTasksPage from "./pages/MyTasksPage";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log(currentUser ? "User logged in" : "No user logged in");
    });

    return () => unsubscribe();
  }, []);

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
          success: {
            iconTheme: { primary: "#27AECC", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#e63946", secondary: "#fff" },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/my-tasks"
          element={user ? <MyTasksPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
