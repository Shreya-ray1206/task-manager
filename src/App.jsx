import './App.css'
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import  {onAuthStateChanged} from "firebase/auth"
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

let didFetch = false
function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser)  => {
       setUser(currentUser);
      console.log(user ? "User logged in" : "No user logged in");
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
      </Routes>
    </Router>
  );
  
}

export default App
