import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Provide both user + verified flag so UI can react appropriately
    const verified = currentUser.emailVerified;
    setUser({ ...currentUser, emailVerified: verified });
    setLoading(false);
  });

  return () => unsub();
}, []);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
