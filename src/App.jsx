import './App.css'
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import  {onAuthStateChanged} from "firebase/auth"
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MyTasksPage from "./pages/MyTasksPage"; 
import { Toaster } from "react-hot-toast"; 

let didFetch = false
function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser)  => {
       setUser(currentUser);
      console.log(currentUser ? "User logged in" : "No user logged in");
    });

     // Fetch Firestore data
    const fetchUsers = async () => {
     if (didFetch) return; // prevent duplicate fetch
       didFetch = true;       
     try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
   };

    fetchUsers();
    return () => unsubscribe();
  }, []);

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
            iconTheme: {
              primary: "#27AECC",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e63946",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Default route → goes to AuthPage if not logged in */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
        />

        {/* Protected route → only logged in users can access */}
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path = "/my-tasks"
          element = {user ? <MyTasksPage/> : <Navigate to= "/" />}
        />

      </Routes>
    </Router>
  );
  
}

export default App
