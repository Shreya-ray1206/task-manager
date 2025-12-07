import React, { useEffect, useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskStatsChart from "./TaskStatsChart";
import TaskStatsAnalysis from "./TaskStatsAnalysis";

/**
 * Helper: safely parse a Firestore Timestamp or JS date-like value into a Date
 * Returns null if it can't parse.
 */
const parseDateSafe = (val) => {
  if (!val) return null;
  // Firestore Timestamp has toDate()
  if (typeof val.toDate === "function") {
    try {
      return val.toDate();
    } catch {
      return null;
    }
  }
  // If it's already a Date
  if (val instanceof Date) return val;
  // If it's a number (ms), or a string
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

  // normalize tasks reference
  const tasks = Array.isArray(tasksFromProvider) ? tasksFromProvider : [];

  const now = new Date();

  // Fetch user info (unchanged)
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) setFullName(snapshot.data().fullName || "User");
      } catch (err) {
        console.error("User fetch error:", err);
      }
    })();
  }, [user]);

  // Compute buckets + deleted list. We treat 'deleted === true' as deleted.
  const tasksByStatus = useMemo(() => {
    const map = { todo: [], inProgress: [], done: [] };
    const deleted = [];

    tasks.forEach((t) => {
      // defensive: ensure t.status string trimmed
      const status = (t.status || "todo").toString();
      if (t.deleted === true) {
        deleted.push(t);
        return;
      }

      // only accept exact keys used across app
      if (status === "todo") map.todo.push(t);
      else if (status === "inProgress") map.inProgress.push(t);
      else if (status === "done") map.done.push(t);
      else {
        // unknown statuses — log to console for debugging
        console.warn("DashboardContent: task with unexpected status", t.id, status);
        // push into todo as fallback
        map.todo.push(t);
      }
    });

    return { byStatus: map, deleted };
  }, [tasks]);

  // createdToday — count tasks (non-deleted) whose createdAt is same day as now
  const createdToday = useMemo(() => {
    let count = 0;
    const suspicious = [];
    tasks.forEach((t) => {
      if (t.deleted === true) return; // ignore deleted for createdToday
      const cr = parseDateSafe(t.createdAt);
      if (!cr) suspicious.push(t.id);
      if (cr && isSameDay(cr, now)) count++;
    });
    if (suspicious.length) {
      // helpful debug: log ids that lack parsable createdAt
      console.debug("DashboardContent: tasks missing/invalid createdAt:", suspicious);
    }
    return count;
  }, [tasks, now]);

  // deletedToday — count deleted tasks with deletedAt same day as now
  const deletedToday = useMemo(() => {
    return tasksByStatus.deleted.filter((t) => {
      const dt = parseDateSafe(t.deletedAt);
      return dt && isSameDay(dt, now);
    }).length;
  }, [tasksByStatus, now]);

  // recentTasks: use provider's tasks (which come ordered by updatedAt probably),
  // but ensure we include deleted ones as well for the "Recent Updated Tasks" panel.
  const recentTasks = useMemo(() => {
    // If provider passed tasks ordered, we still sort defensively by parsed time
    const src = [...tasks];
    src.sort((a, b) => {
      const aTime = parseDateSafe(a.updatedAt) || parseDateSafe(a.createdAt) || new Date(0);
      const bTime = parseDateSafe(b.updatedAt) || parseDateSafe(b.createdAt) || new Date(0);
      return bTime - aTime;
    });
    return src.slice(0, 4);
  }, [tasks]);

  // Stats for chart + analysis
  const chartData = {
    todo: tasksByStatus.byStatus.todo.length,
    inProgress: tasksByStatus.byStatus.inProgress.length,
    done: tasksByStatus.byStatus.done.length,
    deleted: tasksByStatus.deleted.length,
  };

  const stats = {
    todo: chartData.todo,
    inProgress: chartData.inProgress,
    done: chartData.done,
    deleted: chartData.deleted,
    deletedToday,
    createdToday,
    totalVisible: chartData.todo + chartData.inProgress + chartData.done, // matches TaskBoard view
    recentUpdates: tasks.filter((t) => {
      const upd = parseDateSafe(t.updatedAt) || parseDateSafe(t.createdAt);
      return upd && isSameDay(upd, now);
    }).length,
  };

  if (tasksLoading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalVisible}</p>
        </div>

        <div className="bg-gradient-to-r from-[#FF9966] to-[#FF5E62] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-2xl font-bold mt-2">{stats.done}</p>
        </div>

        <div className="bg-gradient-to-r from-[#00c6ff] to-[#0072ff] p-5 rounded-2xl shadow-md text-white">
          <h3 className="text-lg font-semibold">In Progress</h3>
          <p className="text-2xl font-bold mt-2">{stats.inProgress}</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT — Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Updated Tasks</h2>
            <div className="space-y-4">
              {recentTasks.map((task) => {
                const updatedTime = parseDateSafe(task.updatedAt) || parseDateSafe(task.createdAt) || new Date();
                const priority = (task.priority || "medium").toString().toLowerCase();
                const isDeleted = task.deleted === true;

                return (
                  <div
                    key={task.id}
                    className={`bg-gray-50 rounded-xl p-4 shadow-sm border ${
                      isDeleted ? "border-red-300 bg-red-50 opacity-75" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold ${isDeleted ? "text-red-700 line-through" : "text-gray-900"}`}>
                        {task.title}
                        {isDeleted && <span className="ml-2 text-xs text-red-500">(Deleted)</span>}
                      </h3>
                      <span className="text-gray-400 text-xs">
                        {isDeleted ? "🗑️" : task.status === "todo" ? "📝" : task.status === "inProgress" ? "⚙️" : "✅"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{task.description}</p>

                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isDeleted ? "bg-gray-200 text-gray-500" :
                        priority === "high" ? "bg-red-100 text-red-700" :
                        priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {isDeleted ? "DELETED" : priority.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-[10px]">{updatedTime.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Chart + Insights */}
        <div className="h-full">
          <div className="h-full bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <TaskStatsChart data={chartData} />
            <div className="mt-6">
              <TaskStatsAnalysis stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
