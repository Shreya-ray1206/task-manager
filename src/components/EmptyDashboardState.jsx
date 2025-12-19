import React from "react";
import { FiCheckCircle, FiBarChart2, FiClock } from "react-icons/fi";

export default function EmptyDashboardState() {
  return (
    <div className="w-full text-center py-16 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col items-center justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4072/4072183.png"
          alt="No tasks"
          className="w-32 opacity-90 mb-6"
        />

        <h2 className="text-xl font-semibold text-gray-800">
          Your Dashboard Is Empty
        </h2>

        <p className="text-gray-500 mt-2 max-w-md leading-relaxed">
          You haven’t added any tasks yet. Once you create tasks in the board,
          you’ll see insights, progress statistics, and recent activity here.
        </p>

        {/* Helpful mini-features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-xl">
          <div className="p-4 bg-purple-50 rounded-xl flex flex-col items-center">
            <FiClock className="text-2xl text-purple-600 mb-2" />
            <p className="text-sm text-gray-700 font-medium">Track daily progress</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl flex flex-col items-center">
            <FiBarChart2 className="text-2xl text-blue-600 mb-2" />
            <p className="text-sm text-gray-700 font-medium">View recent updated tasks</p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl flex flex-col items-center">
            <FiCheckCircle className="text-2xl text-green-600 mb-2" />
            <p className="text-sm text-gray-700 font-medium">Complete tasks efficiently</p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-8">
          Tasks added in the board will appear here automatically.
        </p>
      </div>
    </div>
  );
}
