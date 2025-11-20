import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";
import { db } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "inProgress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityStyles = {
  high: { color: "bg-red-50 border-red-200" },
  medium: { color: "bg-yellow-50 border-yellow-200" },
  low: { color: "bg-green-50 border-green-200" },
};

const TaskCard = ({ task, onEdit, onDelete, isEditing, onSaveEdit, onCancelEdit }) => {
  const [editValues, setEditValues] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
  });

  const { user } = useAuth();

  useEffect(() => {
    setEditValues({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
    });
  }, [task]);

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
    } catch {
      toast.error("Error updating task");
    }
  };

  const priority = priorityStyles[task.priority] || priorityStyles.medium;

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

          {/* Status dropdown only in edit mode */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Status</label>
            <select
              value={editValues.status}
              onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
              className="text-xs sm:text-sm font-medium rounded-md px-2 py-1.5 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="icon" size="sm" icon={<FiCheck size={14} />} onClick={handleSave} />
            <Button variant="icon" size="sm" icon={<FiX size={14} />} onClick={onCancelEdit} />
          </div>
        </div>
      ) : (
        <>
          {/* Title + Edit/Delete (space-between) */}
          <div className="flex justify-between items-center px-3 pt-2">
            <h4
              className="text-sm sm:text-base font-semibold text-gray-900 flex-1 break-words"
              title={task.title}
            >
              {task.title}
            </h4>

            <div className="flex items-center gap-1">
              <Button variant="icon" size="sm" icon={<FiEdit2 size={14} />} onClick={() => onEdit(task.id)} />
              <Button variant="icon" size="sm" icon={<FiTrash2 size={14} />} onClick={() => onDelete(task.id)} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-3 my-1"></div>

          {/* Description */}
          <div className="px-3 pb-3 text-xs sm:text-sm text-gray-700 leading-snug min-h-[40px]">
            {task.description ? task.description : (
              <span className="italic text-gray-400">No description</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
