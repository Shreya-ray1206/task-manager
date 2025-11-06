import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
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

/* ---------------------- 🧠 Task Board ---------------------- */
const MyTasksBoard = () => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        listenToTasks(currentUser.uid);
      } else {
        toast.error("Please log in to view your tasks.");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const listenToTasks = (userId) => {
    try {
      const tasksRef = collection(db, "users", userId, "tasks");
      const q = query(tasksRef, where("deleted", "==", false));
      return onSnapshot(
        q,
        (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          toast.error("Error fetching tasks: " + error.message);
        }
      );
    } catch (error) {
      toast.error("Error initializing task listener.");
    }
  };

  const handleAddTask = async () => {
    if (!user) return toast.error("Please log in first.");
    if (!newTask.title || !newTask.description)
      return toast.error("Please fill in all fields.");

    try {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        ...newTask,
        createdAt: serverTimestamp(),
        deleted: false,
        status: "todo",
      });
      toast.success("Task created!");
      setNewTask({ title: "", description: "" });
    } catch (error) {
      toast.error("Error adding task: " + error.message);
    }
  };

  const handleSaveEdit = async (taskId, updatedData) => {
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskId);
      await updateDoc(taskRef, {
        title: updatedData.title,
        description: updatedData.description,
        updatedAt: serverTimestamp(),
      });
      toast.success("Task updated!");
      setEditingTaskId(null);
    } catch (error) {
      toast.error("Error updating task: " + error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, { deleted: true });
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Error deleting task: " + error.message);
    }
  };

  const columns = [
    { key: "todo", title: "📝 To Do" },
    { key: "inProgress", title: "⚙️ In Progress" },
    { key: "done", title: "✅ Done" },
  ];

  return (
    <main className="flex-1 p-4 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {columns.map((col) => (
          <div
            key={col.key}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col h-[calc(100vh-5rem)]"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {col.title}
            </h3>

            {col.key === "todo" && (
              <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-xl p-3 shadow-md mb-3">
                <h4 className="text-md font-semibold mb-2">
                  + Create New Task
                </h4>
                <input
                  name="title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-2 text-gray-800 focus:ring-2 focus:ring-[#27AECC] outline-none text-sm"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-2 text-gray-800 focus:ring-2 focus:ring-[#27AECC] outline-none resize-none text-sm"
                  rows={2}
                />
                <Button
                  variant="white"
                  fullWidth
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 overflow-y-auto p-1 flex-1">
              {tasks
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onEdit={(id) => setEditingTaskId(id)}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={() => setEditingTaskId(null)}
                    onDelete={handleDeleteTask}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MyTasksBoard;
