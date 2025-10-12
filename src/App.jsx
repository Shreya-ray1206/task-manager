import './App.css'
import { useEffect } from "react";
import { auth } from "./firebase";
import  {onAuthStateChanged} from "firebase/auth"

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log(user ? "User logged in" : "No user logged in");
    });
    return () => unsubscribe();
  }, []);

  return <div>Task Manager App</div>;
  
}

export default App
