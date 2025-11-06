import React from "react";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import Button from "./Button";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
}) => {
  const [editValues, setEditValues] = useState({
    title: task.title,
    description: task.description,
  });

  useEffect(() => {
    setEditValues({ title: task.title, description: task.description });
  }, [task]);

  return (
    <div
      className="bg-white border border-[#E5E9FF] hover:border-[#2575FC]
                 w-full shadow-md rounded-lg p-4
                 flex flex-col justify-between transition-transform
                 hover:scale-[1.02] hover:shadow-lg"
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editValues.title}
            onChange={(e) =>
              setEditValues({ ...editValues, title: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            value={editValues.description}
            onChange={(e) =>
              setEditValues({ ...editValues, description: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 text-gray-800 text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="icon"
              icon={<FiCheck size={16} />}
              onClick={() => onSaveEdit(task.id, editValues)}
              title="Save"
            />
            <Button
              variant="icon"
              icon={<FiX size={16} />}
              onClick={onCancelEdit}
              title="Cancel"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-base font-semibold text-gray-900 pr-2 leading-tight">
              {task.title}
            </h4>
            <div className="flex gap-2">
              <Button
                variant="icon"
                icon={<FiEdit2 size={16} />}
                onClick={() => onEdit(task.id)}
              />
              <Button
                variant="icon"
                icon={<FiTrash2 size={16} />}
                onClick={() => onDelete(task.id)}
              />
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-snug pl-0">
            {task.description || (
              <span className="italic text-gray-400">No description</span>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default TaskCard;
