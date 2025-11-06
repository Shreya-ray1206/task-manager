import React from "react";
import Sidebar from "../components/Sidebar";

const PageLayout = ({ children }) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#89BAFA] to-[#FAB0FF] flex flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white/60 backdrop-blur-xl shadow-inner">
        <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
