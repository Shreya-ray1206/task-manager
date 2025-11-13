import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
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
import { onAuthStateChanged } from "firebase/auth";
import Button from "./Button";

const MyTasksBoard = () => {
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        listenToTasks(currentUser.uid);
      } else {
        toast.error("Please log in to view tasks.");
      }
    });
    return () => unsub();
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
    } catch (err) {
      toast.error("Error adding task");
    }
  };

  const handleSaveEdit = (taskId, updated) => {
    // update local state optimistically; Firestore updated inside TaskCard
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
    );
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (id) => {
    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, { deleted: true });
      toast.success("Task deleted!");
    } catch (err) {
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
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
      });
      setDraggedTaskId(null);
      toast.success(`Moved to ${status}`);
    } catch {
      toast.error("Error moving task");
    }
  };

  return (
    <main className="flex-1 p-3 sm:p-4 min-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max md:h-full">
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.key)}
            className="bg-white shadow-md rounded-2xl p-3 sm:p-4 flex flex-col h-auto md:h-[calc(100vh-6rem)] transition"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700 sm:text-xl">{col.title}</h3>

            {col.key === "todo" && (
              <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-xl p-3 shadow-md mb-4 sm:mb-3">
                <h4 className="text-md font-semibold mb-2 sm:text-lg">+ Create New Task</h4>

                <InputField
                  label="Title"
                  name="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                  variant="inverted"
                  size="sm"
                />

                {/* ✅ Restored gradient/pastel priority dropdown */}
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1 text-white">Priority</label>
                  <div className="relative">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className={`
                        w-full rounded-md px-3 py-2 text-sm font-medium
                        focus:ring-2 focus:ring-indigo-300 focus:outline-none
                        transition-all duration-200 ease-in-out cursor-pointer
                        appearance-none shadow-sm
                        ${
                          newTask.priority === "high"
                            ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200"
                            : newTask.priority === "medium"
                            ? "bg-gradient-to-r from-amber-50 to-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-gradient-to-r from-emerald-50 to-green-100 text-green-700 border border-green-200"
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

            <div className="flex flex-col gap-3 overflow-y-auto p-1 flex-1 scrollbar-thin scrollbar-thumb-gray-300">
              {tasks
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <div key={task.id} draggable onDragStart={() => handleDragStart(task.id)} className="cursor-grab active:cursor-grabbing">
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
    </main>
  );
};

export default MyTasksBoard;
