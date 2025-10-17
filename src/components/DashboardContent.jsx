import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const DashboardContent = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };
  return (
    <div className="p-6">
      <p className="text-gray-600">
        This is where you’ll see your tasks, reports, and progress.
      </p>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 px-6 py-2 rounded-xl hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardContent;
