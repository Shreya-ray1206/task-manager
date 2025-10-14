import './App.css'
import { useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import  {onAuthStateChanged} from "firebase/auth"

let didFetch = false
function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
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
   <div>
     <h1 className = "text-6xl font-bold mb-4">Hello </h1>
     <button className="px-6 py-4 mt-4 bg-[hotpink] text-white">Click me </button>
   </div>
  );
  
}

export default App
