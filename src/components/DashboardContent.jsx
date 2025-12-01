import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const DashboardContent = () => {
  const { loading, tasks, recentTasks, tasksByStatus } = useTasks();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("User");

  // Optional: Fetch user's full name once
  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setFullName(userDoc.data().fullName);
    };
    fetchUser();
  }, [user]);

  if (loading) return <p className="text-gray-600">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-900">Hi, {fullName} 👋</h1>
      <p className="text-gray-700">Here's your quick overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl font-bold mt-2">{tasks.length}</p>
        </div>

        <div className="bg-gradient-to-r from-[#FF9966] to-[#FF5E62] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-2xl font-bold mt-2">{tasksByStatus.done.length}</p>
        </div>

        <div className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">In Progress</h3>
          <p className="text-2xl font-bold mt-2">{tasksByStatus.inProgress.length}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Updated Tasks</h2>

        {recentTasks.length === 0 ? (
          <p className="text-gray-500">No recent tasks available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentTasks.map((task) => {
              const updatedTime = task.updatedAt?.toDate() || task.createdAt?.toDate();
              const priority = (task.priority || "medium").toLowerCase();

              return (
                <div
                  key={task.id}
                  className="bg-white shadow-md rounded-2xl p-4 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>

                  <div className="mt-3 flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        priority === "high"
                          ? "bg-red-100 text-red-700"
                          : priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {priority.toUpperCase()}
                    </span>

                    <span className="text-gray-400 text-xs">
                      {task.status === "todo"
                        ? "📝 To do"
                        : task.status === "inProgress"
                        ? "⚙️ In progress"
                        : "✅ Done"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mt-2 text-right">
                    Updated: {updatedTime.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
