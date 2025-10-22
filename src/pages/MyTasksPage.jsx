import React from "react";
import Sidebar from "../components/Sidebar";
import MyTasksBoard from "../components/MyTasksBoard";

const MyTasksPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#89BAFA] to-[#FAB0FF] flex flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task Board */}
      <div className="flex-1 p-8 overflow-y-auto bg-white/90 backdrop-blur-md  shadow-inner">
        <MyTasksBoard />
      </div>
    </div>
  );
};

export default MyTasksPage;
