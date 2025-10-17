import React from "react";
import DashboardContent from "../components/DashboardContent";

const DashboardPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard 🎯</h1>
       <DashboardContent/>
    </div>
  );
};

export default DashboardPage;
