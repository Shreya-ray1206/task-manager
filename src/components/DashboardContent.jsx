import React, { useEffect, useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskStatsChart from "./TaskStatsChart";
import TaskStatsAnalysis from "./TaskStatsAnalysis";
import EmptyDashboardState from "./EmptyDashboardState";

// Safe date parser
const parseDateSafe = (val) => {
  if (!val) return null;
  if (typeof val.toDate === "function") {
    try {
      return val.toDate();
    } catch {
      return null;
    }
  }
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const DashboardContent = () => {
  const { loading: tasksLoading, tasks: tasksFromProvider = [] } = useTasks() || {};
  const { user } = useAuth();
  const [fullName, setFullName] = useState("User");

  const tasks = Array.isArray(tasksFromProvider) ? tasksFromProvider : [];
  const now = new Date();

  // Fetch full name
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          setFullName(snapshot.data().fullName || "User");
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    })();
  }, [user]);

  // FIXED: bucket tasks AFTER filtering out deleted ones
  const tasksByStatus = useMemo(() => {
    const map = { todo: [], inProgress: [], done: [] };
    const deleted = [];

    tasks.forEach((t) => {
      const status = (t.status || "todo").toString().trim();

      if (t.deleted === true) {
        deleted.push(t);
        return;
      }

      if (status === "todo") map.todo.push(t);
      else if (status === "inProgress") map.inProgress.push(t);
      else if (status === "done") map.done.push(t);
      else {
        console.warn("Unexpected status:", t.id, status);
        map.todo.push(t);
      }
    });

    return { byStatus: map, deleted };
  }, [tasks]);

  // created today
  const createdToday = useMemo(() => {
    return tasks.filter((t) => {
      if (t.deleted === true) return false;
      const cr = parseDateSafe(t.createdAt);
      return cr && isSameDay(cr, now);
    }).length;
  }, [tasks, now]);

  // deleted today
  const deletedToday = useMemo(() => {
    return tasksByStatus.deleted.filter((t) => {
      const dt = parseDateSafe(t.deletedAt);
      return dt && isSameDay(dt, now);
    }).length;
  }, [tasksByStatus, now]);

  // recent tasks (include deleted)
  const recentTasks = useMemo(() => {
    const src = [...tasks];
    src.sort((a, b) => {
      const aTime = parseDateSafe(a.updatedAt) || parseDateSafe(a.createdAt) || new Date(0);
      const bTime = parseDateSafe(b.updatedAt) || parseDateSafe(b.createdAt) || new Date(0);
      return bTime - aTime;
    });
    return src.slice(0, 4);
  }, [tasks]);

  // FIXED: chart data (only non-deleted tasks)
  const chartData = {
    todo: tasksByStatus.byStatus.todo.length,
    inProgress: tasksByStatus.byStatus.inProgress.length,
    done: tasksByStatus.byStatus.done.length,
    deleted: tasksByStatus.deleted.length,
  };

  // FIXED: totalVisible is now 100% correct
  const totalVisible =
    tasksByStatus.byStatus.todo.length +
    tasksByStatus.byStatus.inProgress.length +
    tasksByStatus.byStatus.done.length;

  const stats = {
    ...chartData,
    deletedToday,
    createdToday,
    totalVisible,
    recentUpdates: tasks.filter((t) => {
      const upd = parseDateSafe(t.updatedAt) || parseDateSafe(t.createdAt);
      return upd && isSameDay(upd, now);
    }).length,
  };

  if (tasksLoading) return <p>Loading dashboard...</p>;

  // BEFORE RETURN — compute empty state
const isEmpty = !tasksLoading && stats.totalVisible === 0;

return (
  <div className="space-y-8">
    {/* If NO tasks → show empty dashboard */}
    {isEmpty ? (
      <EmptyDashboardState />
    ) : (
      <>
{/* Top Stats */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

  {/* Total Tasks */}
  <div className="bg-gradient-to-r from-[#7F00FF] to-[#E100FF] p-3 sm:p-4 rounded-2xl shadow-lg text-white">
    <h3 className="text-xs sm:text-sm font-medium">Total</h3>
    <p className="text-xl sm:text-2xl font-bold mt-1">
      {stats.totalVisible}
    </p>
  </div>

  {/* To-Do */}
  <div className="bg-gradient-to-r from-[#F7971E] to-[#FFD200] p-3 sm:p-4 rounded-2xl shadow-lg text-white">
    <h3 className="text-xs sm:text-sm font-medium">To-Do</h3>
    <p className="text-xl sm:text-2xl font-bold mt-1">
      {stats.todo}
    </p>
  </div>

  {/* Completed */}
  <div className="bg-gradient-to-r from-[#11998E] to-[#38EF7D] p-3 sm:p-4 rounded-2xl shadow-lg text-white">
    <h3 className="text-xs sm:text-sm font-medium">Done</h3>
    <p className="text-xl sm:text-2xl font-bold mt-1">
      {stats.done}
    </p>
  </div>

  {/* In Progress */}
  <div className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] p-3 sm:p-4 rounded-2xl shadow-lg text-white">
    <h3 className="text-xs sm:text-sm font-medium">In Progress</h3>
    <p className="text-xl sm:text-2xl font-bold mt-1">
      {stats.inProgress}
    </p>
  </div>

</div>



        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT — recent */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Updated Tasks</h2>

              <div className="space-y-4">
                {recentTasks.map((task) => {
                  const updatedTime =
                    parseDateSafe(task.updatedAt) ||
                    parseDateSafe(task.createdAt) ||
                    new Date();
                  const isDeleted = task.deleted === true;

                  return (
                    <div
                      key={task.id}
                      className={`bg-gray-50 rounded-xl p-4 shadow-sm border ${
                        isDeleted
                          ? "border-red-300 bg-red-50 opacity-75"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3
                          className={`text-sm font-semibold ${
                            isDeleted
                              ? "text-red-700 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                          {isDeleted && (
                            <span className="ml-2 text-xs text-red-500">
                              (Deleted)
                            </span>
                          )}
                        </h3>
                        <span className="text-gray-400 text-xs">
                          {isDeleted
                            ? "🗑️"
                            : task.status === "todo"
                            ? "📝"
                            : task.status === "inProgress"
                            ? "⚙️"
                            : "✅"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {task.description}
                      </p>

                      <div className="mt-2 flex justify-between items-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md ${
                            isDeleted
                              ? "bg-gray-200 text-gray-500"
                              : task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isDeleted
                            ? "DELETED"
                            : (task.priority || "MEDIUM").toUpperCase()}
                        </span>

                        <span className="text-gray-400 text-[10px]">
                          {updatedTime.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — chart + insights */}
          <div className="h-full">
            <div className="h-full bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <TaskStatsChart data={chartData} />
              <div className="mt-6">
                <TaskStatsAnalysis stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
 );

};

export default DashboardContent;
