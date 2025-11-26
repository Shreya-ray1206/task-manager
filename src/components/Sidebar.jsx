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
    { label: "🏠 Dashboard", path: "/dashboard", disabled: false },
    { label: "📝 My Task", path: "/my-tasks", disabled: false },

    // Disabled items
    { label: "📊 Statistics", path: "/statistics", disabled: true },
    { label: "📁 Projects", path: "/projects", disabled: true },
    { label: "📅 Calendar", path: "/calendar", disabled: true },
    { label: "⚙️ Settings", path: "/settings", disabled: true },
  ];

  return (
    <div className="
      w-64 h-screen 
      text-white shadow-2xl flex flex-col justify-between
      sm:bg-gradient-to-b sm:from-[#090979] sm:to-[#27AECC]
      bg-[linear-gradient(to_bottom,rgba(9,9,121,0.85),rgba(39,174,204,0.85))]
      backdrop-blur-md transition-all duration-300
    ">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-10 tracking-wide text-center">
          TaskFlow
        </h1>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => !item.disabled && navigate(item.path)}
              className={`
                p-3 rounded-lg transition-all duration-300 cursor-pointer 
                ${item.disabled ? 
                  "opacity-40 cursor-not-allowed" :
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#C7E8FF] to-[#9BE0FF] text-[#090979] font-semibold shadow-md"
                    : "hover:bg-white/20 text-white/90"
                }
              `}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6">
        <Button variant="white" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
