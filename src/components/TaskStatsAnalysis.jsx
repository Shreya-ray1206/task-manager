import React from "react";

export default function TaskStatsAnalysis({ stats }) {
  const { todo, inProgress, done, deleted, deletedToday, createdToday, totalVisible } = stats;
  const totalActive = (todo || 0) + (inProgress || 0) + (done || 0);
  const completionRate = totalActive > 0 ? Math.round((done / totalActive) * 100) : 0;

  return (
    <div className="mt-4 p-6 bg-white rounded-2xl border shadow-md text-sm">
      <h4 className="font-semibold mb-4 text-gray-800 text-lg">Daily Insights</h4>

      <div className="mb-4">
        <div className="flex justify-between mb-1 text-gray-700">
          <span>Task Completion</span>
          <span className="font-medium">{completionRate}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${completionRate}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md">
          <span className="text-red-600 text-lg">🗑️</span>
          <span className="text-gray-700 font-medium">{deletedToday} tasks deleted today</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
          <span className="text-blue-600 text-lg">✍️</span>
          <span className="text-gray-700 font-medium">{createdToday} tasks created today</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-red-100 p-2 rounded-md">
        <span className="text-red-700 text-lg">🗑️</span>
        <span className="text-gray-700 font-medium">{deleted} total deleted tasks</span>
        <span className="ml-auto text-xs text-gray-500">Visible: {totalVisible}</span>
      </div>
    </div>
  );
}
