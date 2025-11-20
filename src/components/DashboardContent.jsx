import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";


const DashboardContent = () => {
  const { user } = useAuth();                       // ⬅️ Get logged-in user from global context
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setFullName(userDoc.data().fullName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);   // <-- re-run if user changes

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">
        Hi, {fullName || user?.displayName || "User"} 👋
      </h1>

      <p className="text-gray-600">
        Welcome back! Here’s your dashboard overview.
      </p>

      <div className="mt-8 shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Tasks</h2>
        <p className="text-gray-500">Task list will appear here soon...</p>
      </div>
    </div>
  );
};

export default DashboardContent;


