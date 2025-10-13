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

  return (
   <div>
     <h1 className = "text-6xl font-bold mb-4">Hello </h1>
     <button className="px-6 py-4 mt-4 bg-[hotpink] text-white">Click me </button>
   </div>
  );
  
}

export default App
