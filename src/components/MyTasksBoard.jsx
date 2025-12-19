import React, { useState } from "react";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";
import InputField from "./InputField";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "../context/AuthProvider";
import { useTasks } from "../context/TaskContext";
import {
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";

const MyTasksBoard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });

  // ------------------------
  // ADD TASK
  // ------------------------
  const handleAddTask = async () => {
    if (!user) return toast.error("Please log in first.");
    if (!newTask.title.trim() || !newTask.description.trim()) {
      return toast.error("Fill in all fields.");
    }

    try {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        ...newTask,
        status: "todo",
        deleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewTask({ title: "", description: "", priority: "medium" });
      toast.success("Task added");
    } catch {
      toast.error("Error adding task");
    }
  };

  // ------------------------
  // DELETE TASK
  // ------------------------
  const handleDeleteClick = (taskId, taskTitle) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.taskId || !user) return;

    try {
      await updateDoc(doc(db, "users", user.uid, "tasks", deleteModal.taskId), {
        deleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Task deleted");
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
  };

  // ------------------------
  // DRAG & DROP
  // ------------------------
  const handleDragStart = (id) => setDraggedTaskId(id);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (status) => {
    if (!draggedTaskId || !user) return;

    try {
      await updateDoc(
        doc(db, "users", user.uid, "tasks", draggedTaskId),
        {
          status,
          updatedAt: serverTimestamp(),
        }
      );
      setDraggedTaskId(null);
    } catch {
      toast.error("Error moving task");
    }
  };

  // ------------------------
  // EDIT HANDLERS
  // ------------------------
  const handleEdit = (id) => setEditingTaskId(id);
  const handleCancelEdit = () => setEditingTaskId(null);

  const priorityStyles = {
    high: "bg-red-50 border-red-200",
    medium: "bg-yellow-50 border-yellow-200",
    low: "bg-green-50 border-green-200",
  };

  return (
    <main className="flex-1 relative">
      {/* ===== CONFIRM DELETE MODAL ===== */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* ===== PRIORITY LEGEND ===== */}
      <div className="sticky top-2 z-10 mx-auto w-fit bg-white/90 px-4 py-2 rounded-xl shadow-md mb-4">
        <div className="flex gap-4">
          {[
            { key: "high", label: "High", color: "bg-red-500" },
            { key: "medium", label: "Medium", color: "bg-yellow-400" },
            { key: "low", label: "Low", color: "bg-green-500" },
          ].map((p) => (
            <div key={p.key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${p.color}`} />
              <span className="text-xs font-medium text-gray-700">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOARD GRID ===== */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-3 gap-4
          pt-4
          md:h-[calc(100vh-6rem)]
          md:overflow-hidden
        "
      >
        {/* ===== LEFT COLUMN ===== */}
        <div className="flex flex-col gap-4 md:h-full md:min-h-0">
          {/* CREATE TASK */}
          <div className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-3">➕ Create Task</h3>

            <InputField
              label="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
              size="sm"
              labelColor="text-white"
            />

            <InputField
              label="Description"
              multiline
              rows={2}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
              size="sm"
              labelColor="text-white"
            />

            <div className="mt-2">
              <label className="block text-sm mb-1 text-white">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className={`w-full rounded-md px-3 py-2 text-sm text-gray-700 border-2 ${priorityStyles[newTask.priority]}`}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="mt-3">
              <Button variant="white" fullWidth onClick={handleAddTask}>
                Add Task
              </Button>
            </div>
          </div>

          {/* ===== TODO ===== */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("todo")}
            className="
              bg-white rounded-2xl p-4 shadow-md
              md:flex md:flex-col md:flex-1 md:min-h-0
            "
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              📝 To Do
            </h3>

            <div className="flex flex-col gap-3 md:flex-1 md:overflow-y-auto">
              {tasks
                .filter((t) => t.status === "todo" && !t.deleted)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <TaskCard
                      task={task}
                      isEditing={editingTaskId === task.id}
                      onEdit={handleEdit}
                      onCancelEdit={handleCancelEdit}
                      onDeleteClick={handleDeleteClick}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ===== IN PROGRESS ===== */}
        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("inProgress")}
          className="bg-white rounded-2xl p-4 shadow-md md:h-full md:flex md:flex-col md:min-h-0"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            ⚙️ In Progress
          </h3>

          <div className="flex flex-col gap-3 md:flex-1 md:overflow-y-auto">
            {tasks
              .filter((t) => t.status === "inProgress" && !t.deleted)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  <TaskCard
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                    onDeleteClick={handleDeleteClick}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* ===== DONE ===== */}
        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("done")}
          className="bg-white rounded-2xl p-4 shadow-md md:h-full md:flex md:flex-col md:min-h-0"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            ✅ Done
          </h3>

          <div className="flex flex-col gap-3 md:flex-1 md:overflow-y-auto">
            {tasks
              .filter((t) => t.status === "done" && !t.deleted)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  <TaskCard
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                    onDeleteClick={handleDeleteClick}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyTasksBoard;