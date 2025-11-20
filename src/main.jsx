import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";



// ✅ Register Service Worker HERE
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => console.log("✔️ Service Worker Registered"))
    .catch((err) => console.log("SW Error:", err));
}

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
