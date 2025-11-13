import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";
import { db, auth } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const statusOptions = [
  { value: "todo", label: "To Do", color: "bg-purple-100 text-purple-700" },
  { value: "inProgress", label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  { value: "done", label: "Done", color: "bg-green-100 text-green-700" },
];

const priorityStyles = {
  high: { label: "High", color: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700" },
  medium: { label: "Medium", color: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", color: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700" },
};

const TaskCard = ({ task, onEdit, onDelete, isEditing, onSaveEdit, onCancelEdit }) => {
  const [editValues, setEditValues] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo", // include status in editValues
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    });
  }, []);

  useEffect(() => {
    setEditValues({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
    });
  }, [task]);

  // Save edits including status
  const handleSave = async () => {
    if (!editValues.title.trim() || !editValues.description.trim()) {
      toast.error("Title and Description cannot be empty.");
      return;
    }
    if (!user) return toast.error("Please log in first.");

    try {
      const ref = doc(db, "users", user.uid, "tasks", task.id);
      await updateDoc(ref, {
        title: editValues.title,
        description: editValues.description,
        status: editValues.status,
        updatedAt: serverTimestamp(),
      });
      toast.success("Task updated!");
      onSaveEdit(task.id, editValues);
    } catch (err) {
      toast.error("Error updating task");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!user) return toast.error("Please log in first.");
    try {
      const ref = doc(db, "users", user.uid, "tasks", task.id);
      await updateDoc(ref, { status: newStatus, updatedAt: serverTimestamp() });
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error("Error updating status");
    }
  };

  const priority = priorityStyles[task.priority] || priorityStyles.medium;
  const currentStatus = statusOptions.find((s) => s.value === task.status);

  return (
    <div className={`relative border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${priority.color}`}>
      {isEditing ? (
        <div className="p-3 flex flex-col gap-2">
          <InputField
            label="Title"
            name="title"
            value={editValues.title}
            onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
            required
            size="sm"
          />
          <InputField
            label="Description"
            name="description"
            multiline
            rows={2}
            value={editValues.description}
            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
            required
            size="sm"
          />

          {/* Status dropdown in edit mode */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Status</label>
            <select
              value={editValues.status}
              onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
              className="text-xs sm:text-sm font-medium rounded-md px-2 py-1.5 focus:ring-2 focus:ring-indigo-300 focus:outline-none cursor-pointer transition-all duration-200"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="icon" size="sm" icon={<FiCheck size={14} />} onClick={handleSave} />
            <Button variant="icon" size="sm" icon={<FiX size={14} />} onClick={onCancelEdit} />
          </div>
        </div>
      ) : (
        <>
          {/* Drag-and-drop / hover dropdown */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 pt-2">
            <div className="relative group w-fit sm:order-2 mb-1 sm:mb-0">
              <button
                className={`flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 border ${currentStatus.color} border-transparent hover:ring-1 hover:ring-indigo-400 transition whitespace-nowrap`}
              >
                {currentStatus.label} ▾
              </button>
              <div className="absolute mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg border border-gray-100 z-50 w-32 right-0 sm:right-0 sm:left-auto left-0 sm:left-auto">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`block w-full text-left text-xs px-3 py-1.5 rounded-md ${opt.color} hover:opacity-80`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title + Icons */}
            <div className="flex justify-between items-center w-full gap-2">
              <h4
                className="text-sm sm:text-base font-semibold text-gray-900 flex-1 break-words sm:line-clamp-1"
                title={task.title}
              >
                {task.title}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="icon" size="sm" icon={<FiEdit2 size={14} />} onClick={() => onEdit(task.id)} />
                <Button variant="icon" size="sm" icon={<FiTrash2 size={14} />} onClick={() => onDelete(task.id)} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-3 my-1"></div>

          {/* Description */}
          <div className="px-3 pb-3 text-xs sm:text-sm text-gray-700 leading-snug min-h-[40px]">
            {task.description ? task.description : <span className="italic text-gray-400">No description</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;

