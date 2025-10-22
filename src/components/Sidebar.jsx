import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const menuItems = [
    { label: "🏠 Dashboard", path: "/dashboard" },
    { label: "📝 My Task", path: "/my-tasks" },
    { label: "📊 Statistics", path: "/statistics" },
    { label: "📁 Projects", path: "/projects" },
    { label: "📅 Calendar", path: "/calendar" },
    { label: "⚙️ Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-white/20 backdrop-blur-md text-white shadow-xl flex flex-col justify-between p-4">
      {/* Logo */}
      <div>
        <div className="text-2xl font-bold text-white mb-8 tracking-wide">TaskFlow</div>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-[#090979] to-[#27AECC] text-white shadow-md"
                  : "hover:bg-white/20 text-white/90"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
