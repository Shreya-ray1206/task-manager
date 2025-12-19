import React from "react";
import Button from "./Button";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div className="bg-white rounded-2xl p-6 w-full sm:max-w-sm shadow-lg mx-2 sm:mx-0">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          {title || "Confirm"}
        </h3>
        <p className="text-gray-700 mb-5 text-sm sm:text-base text-center break-words">
          {message || "Are you sure?"}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            No
          </Button>
          <Button variant="red" onClick={onConfirm} className="flex-1">
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
