import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
import InputField from "./InputField";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Button from "./Button";
import { useAuth } from "../context/AuthProvider.jsx";

const MyTasksBoard = () => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) listenToTasks(user.uid);
  }, []);

  const listenToTasks = (userId) => {
    try {
      const ref = collection(db, "users", userId, "tasks");
      const q = query(ref, where("deleted", "==", false));

      return onSnapshot(q, (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    } catch (err) {
      toast.error("Error fetching tasks");
    }
  };

  const handleAddTask = async () => {
    if (!user) return toast.error("Please log in first.");
    if (!newTask.title.trim() || !newTask.description.trim())
      return toast.error("Fill in all fields.");

    try {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        ...newTask,
        createdAt: serverTimestamp(),
        deleted: false,
        status: "todo",
      });

      setNewTask({ title: "", description: "", priority: "medium" });
      toast.success("Task added!");
    } catch {
      toast.error("Error adding task");
    }
  };

  const handleSaveEdit = (taskId, updated) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
    );
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (id) => {
    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, { 
        deleted: true,
        deletedAt: serverTimestamp()
      });
      toast.success("Task deleted!");
    } catch {
      toast.error("Error deleting task");
    }
  };

  const columns = [
    { key: "todo", title: "📝 To Do" },
    { key: "inProgress", title: "⚙️ In Progress" },
    { key: "done", title: "✅ Done" },
  ];

  const handleDragStart = (id) => setDraggedTaskId(id);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (status) => {
    if (!draggedTaskId || !user) return;

    try {
      const ref = doc(db, "users", user.uid, "tasks", draggedTaskId);
      await updateDoc(ref, { status, updatedAt: serverTimestamp() });

      setDraggedTaskId(null);
      toast.success(`Moved to ${status}`);
    } catch {
      toast.error("Error moving task");
    }
  };

  return (
    <main className="flex-1 p-3 sm:p-4 min-h-[calc(100vh-5rem)] overflow-y-auto">

      {/* ⭐ BOARD COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max md:h-full">
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.key)}
            className="bg-white shadow-md rounded-2xl p-3 sm:p-4 flex flex-col h-auto md:h-[calc(100vh-6rem)] transition"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700 sm:text-xl">
              {col.title}
            </h3>

            {/* CREATE TASK UI */}
            {col.key === "todo" && (
              <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-xl p-3 shadow-md mb-4 sm:mb-3">
                <h4 className="text-md font-semibold mb-2 sm:text-lg">
                  + Create New Task
                </h4>

                <InputField
                  label="Title"
                  name="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                  variant="inverted"
                  size="sm"
                />

                <InputField
                  label="Description"
                  name="description"
                  multiline
                  rows={2}
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  required
                  variant="inverted"
                  size="sm"
                />

                {/* PRIORITY SELECTOR */}
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1 text-white">
                    Priority
                  </label>

                  <div className="relative">
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className={`w-full rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-300
                        ${
                          newTask.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : newTask.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      ▾
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Button variant="white" fullWidth onClick={handleAddTask}>
                    Add Task
                  </Button>
                </div>
              </div>
            )}

            {/* TASK LIST */}
            <div className="flex flex-col gap-3 overflow-y-auto p-1 flex-1 scrollbar-thin scrollbar-thumb-gray-300">
              {tasks
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      isEditing={editingTaskId === task.id}
                      onEdit={(id) => setEditingTaskId(id)}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={() => setEditingTaskId(null)}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {/* ⭐ Priority Legend under the board */}
<div className="w-full flex justify-center mt-6 mb-4">
  <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-full shadow-sm text-xs">

    <div className="flex items-center gap-1">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
      <span className="text-gray-600">High</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
      <span className="text-gray-600">Medium</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
      <span className="text-gray-600">Low</span>
    </div>

  </div>
</div>



    </main>
  );
};

export default MyTasksBoard;
