import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Button from "./Button";

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
    <div className="w-64 h-screen bg-gradient-to-b from-[#090979] to-[#27AECC] text-white shadow-2xl flex flex-col justify-between ">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-10 tracking-wide text-center">
          TaskFlow
        </h1>

        {/* Navigation */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-[#C7E8FF] to-[#9BE0FF] text-[#090979] font-semibold shadow-md"
                  : "hover:bg-white/20 text-white/90"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-6">
        <Button
          variant="white"
          fullWidth
          onClick={handleLogout}
         >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
