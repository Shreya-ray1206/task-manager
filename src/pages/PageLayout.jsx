import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const PageLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#89BAFA] to-[#FAB0FF] flex flex-col sm:flex-row">

      {/* Mobile Navbar */}
      <header className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-md sm:hidden">
        <h1 className="text-xl font-bold text-indigo-700">TaskFlow</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
          fixed sm:static
          top-0 left-0 
          h-full w-64 sm:w-60
          z-40 sm:z-auto
          bg-white/70 backdrop-blur-md shadow-lg
          transition-transform duration-300
        `}
      >
        <Sidebar />
      </aside>

      {/* ⭐ MAIN CONTENT → Only this scrolls */}
      <div className="flex-1 h-full overflow-y-auto bg-white/60 backdrop-blur-xl shadow-inner p-4 sm:p-8 rounded-t-2xl sm:rounded-none mt-2 sm:mt-0">
        {children}
      </div>

    </div>
  );
};

export default PageLayout;
