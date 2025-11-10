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
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // 🧠 Firebase auth & listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        listenToTasks(currentUser.uid);
      } else {
        toast.error("Please log in to view your tasks.");
      }
    });
    return () => unsubAuth();
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

  // ➕ Add new task
  const handleAddTask = async () => {
    if (!user) return toast.error("Please log in first.");
    if (!newTask.title.trim() || !newTask.description.trim())
      return toast.error("Please fill in all fields.");

    try {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        ...newTask,
        createdAt: serverTimestamp(),
        deleted: false,
        status: "todo",
      });
      setNewTask({ title: "", description: "" });
      toast.success("Task added!");
    } catch (err) {
      toast.error("Error adding task");
    }
  };

  // ✏️ Edit + Save
  const handleSaveEdit = async (taskId, updatedData) => {
    if (!updatedData.title.trim() || !updatedData.description.trim())
      return toast.error("Fields cannot be empty");
    try {
      const ref = doc(db, "users", user.uid, "tasks", taskId);
      await updateDoc(ref, {
        title: updatedData.title,
        description: updatedData.description,
        updatedAt: serverTimestamp(),
      });
      setEditingTaskId(null);
      toast.success("Task updated!");
    } catch (err) {
      toast.error("Error updating task");
    }
  };

  // 🗑️ Soft delete
  const handleDeleteTask = async (id) => {
    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, { deleted: true });
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  // 💡 Columns setup
  const columns = [
    { key: "todo", title: "📝 To Do" },
    { key: "inProgress", title: "⚙️ In Progress" },
    { key: "done", title: "✅ Done" },
  ];

  // 🧲 Native drag handlers
  const handleDragStart = (id) => setDraggedTaskId(id);
  const handleDragOver = (e) => e.preventDefault(); // allow drop
  const handleDrop = async (status) => {
    if (!draggedTaskId || !user) return;
    try {
      const ref = doc(db, "users", user.uid, "tasks", draggedTaskId);
      await updateDoc(ref, { status, updatedAt: serverTimestamp() });
      setDraggedTaskId(null);
      toast.success(`Moved to ${status}`);
    } catch (err) {
      toast.error("Error moving task");
    }
  };

  return (
    <main className="flex-1 p-4 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.key)}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col h-[calc(100vh-5rem)]"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {col.title}
            </h3>

            {/* New Task (only in To Do) */}
            {col.key === "todo" && (
              <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-xl p-3 shadow-md mb-3">
                <h4 className="text-md font-semibold mb-2">+ Create New Task</h4>
                <InputField
                  label="Task title"
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
                <div className="mt-2">
                  <Button variant="white" fullWidth onClick={handleAddTask}>
                    Add Task
                  </Button>
                </div>
              </div>
            )}

            {/* Tasks */}
            <div className="flex flex-col gap-3 overflow-y-auto p-1 flex-1">
              {tasks
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="cursor-grab active:cursor-grabbing transition-all duration-150"
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
    </main>
  );
};

export default MyTasksBoard;

