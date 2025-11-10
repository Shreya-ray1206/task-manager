import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
}) => {
  const [editValues, setEditValues] = useState({
    title: task.title || "",
    description: task.description || "",
  });

  useEffect(() => {
    setEditValues({ title: task.title || "", description: task.description || "" });
  }, [task]);

  const handleSave = () => {
    if (!editValues.title.trim() || !editValues.description.trim()) {
      toast.error("Title and Description cannot be empty.");
      return;
    }
    onSaveEdit(task.id, editValues);
  };

  return (
    <div
      className="bg-white border border-[#E5E9FF] hover:border-[#2575FC]
                 shadow-sm rounded-lg p-3
                 flex flex-col justify-between transition-all
                 hover:shadow-md"
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
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

          <div className="flex justify-end gap-2 mt-1">
            <Button
              variant="icon"
              size="sm"
              icon={<FiCheck size={14} />}
              onClick={handleSave}
              title="Save"
            />
            <Button
              variant="icon"
              size="sm"
              icon={<FiX size={14} />}
              onClick={onCancelEdit}
              title="Cancel"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-semibold text-gray-900 pr-2 leading-snug break-words">
              {task.title}
            </h4>
            <div className="flex gap-1">
              <Button
                variant="icon"
                size="sm"
                icon={<FiEdit2 size={14} />}
                onClick={() => onEdit(task.id)}
              />
              <Button
                variant="icon"
                size="sm"
                icon={<FiTrash2 size={14} />}
                onClick={() => onDelete(task.id)}
              />
            </div>
          </div>

          <p className="text-gray-700 text-xs leading-snug pl-0 break-words">
            {task.description || <span className="italic text-gray-400">No description</span>}
          </p>
        </>
      )}
    </div>
  );
};

export default TaskCard;


