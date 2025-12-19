import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";
import { db } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";

const TaskCard = ({ task, onEdit, onDeleteClick, isEditing, onCancelEdit }) => {
  const { user } = useAuth();

  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  // ------------------------
  // INIT EDIT VALUES
  // ------------------------
  useEffect(() => {
    setEditValues({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
    });
  }, [task]);

  // ------------------------
  // SAVE EDIT
  // ------------------------
  const handleSave = async () => {
    if (!editValues.title.trim() || !editValues.description.trim()) {
      toast.error("Title and description cannot be empty.");
      return;
    }
    if (!user) return toast.error("Please log in first.");

    try {
      await updateDoc(doc(db, "users", user.uid, "tasks", task.id), {
        title: editValues.title,
        description: editValues.description,
        status: editValues.status,
        updatedAt: serverTimestamp(),
      });
      toast.success("Task updated");
      onCancelEdit();
    } catch (err) {
      console.error(err);
      toast.error("Error updating task");
    }
  };

  // ------------------------
  // STYLES
  // ------------------------
  const priorityStyles = {
    high: "bg-red-50 border-red-200",
    medium: "bg-yellow-50 border-yellow-200",
    low: "bg-green-50 border-green-200",
  };

  const formatDate = (val) => {
    if (!val) return "";
    if (typeof val.toDate === "function") return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  // ------------------------
  // DELETE HANDLER (MOBILE SAFE)
  // ------------------------
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent draggable interference
    onDeleteClick(task.id, task.title);
  };

  return (
    <div
      className={`relative border rounded-xl shadow-sm hover:shadow-md transition-all ${
        priorityStyles[task.priority] || priorityStyles.medium
      }`}
    >
      {isEditing ? (
        // ================= EDIT MODE =================
        <div className="p-3 flex flex-col gap-2">
          <InputField
            label="Title"
            value={editValues.title}
            onChange={(e) =>
              setEditValues({ ...editValues, title: e.target.value })
            }
            required
            size="sm"
          />
          <InputField
            label="Description"
            multiline
            rows={2}
            value={editValues.description}
            onChange={(e) =>
              setEditValues({ ...editValues, description: e.target.value })
            }
            required
            size="sm"
          />
          <div>
            <label className="text-xs font-medium text-gray-600">Status</label>
            <select
              value={editValues.status}
              onChange={(e) =>
                setEditValues({ ...editValues, status: e.target.value })
              }
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="icon"
              size="sm"
              icon={<FiCheck size={14} />}
              onClick={handleSave}
            />
            <Button
              variant="icon"
              size="sm"
              icon={<FiX size={14} />}
              onClick={onCancelEdit}
            />
          </div>
        </div>
      ) : (
        // ================= VIEW MODE =================
        <>
          <div className="flex justify-between items-center px-3 pt-2">
            <h4 className="text-sm font-semibold break-words">{task.title}</h4>
            <div className="flex gap-1">
              <Button
                variant="icon"
                size="sm"
                icon={<FiEdit2 size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task.id);
                }}
              />
              <Button
                variant="icon"
                size="sm"
                icon={<FiTrash2 size={14} />}
                onClick={handleDeleteClick}
                onTouchEnd={handleDeleteClick} // Mobile tap support
              />
            </div>
          </div>

          <div className="border-t my-1 mx-3" />

          <div className="px-3 text-xs text-gray-700 min-h-[40px]">
            {task.description || (
              <span className="italic text-gray-400">No description</span>
            )}
          </div>

          <div className="px-3 pb-2 text-[10px] text-gray-500 text-right">
            {task.updatedAt
              ? `Updated: ${formatDate(task.updatedAt)}`
              : `Created: ${formatDate(task.createdAt)}`}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;