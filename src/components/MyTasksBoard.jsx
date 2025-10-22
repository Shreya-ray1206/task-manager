import React, { useState } from "react";

const pastelColors = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-orange-100",
  "bg-teal-100",
];

const MyTasksBoard = () => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description)
      return alert("Please fill in all fields.");

    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      color,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "" });
  };

  // 🧩 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (task) {
      setTasks((prev) => prev.filter((t) => t.id.toString() !== taskId));
      setDoneTasks((prev) => [...prev, task]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="flex flex-col gap-8">
      {/* 🔹 Top Section: Create + Active Tasks */}
      <div className="flex flex-wrap gap-6">
        {/* 🟢 Create New Card */}
        <div className="bg-white shadow-lg rounded-xl p-5 w-80">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Create New Card
          </h3>
          <input
            name="title"
            placeholder="Task title"
            value={newTask.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-[#27AECC] outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-[#27AECC] outline-none"
          />
          <button
            onClick={handleAddTask}
            className="w-full bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Add Task
          </button>
        </div>

        {/* 🧾 Task Cards */}
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className={`${task.color} w-80 shadow-md rounded-xl p-4 cursor-grab active:cursor-grabbing transition hover:scale-[1.02]`}
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h4>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
        ))}
      </div>

      {/* ✅ Done Section */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-white/80 border-2 border-dashed border-[#27AECC] shadow-inner rounded-2xl p-6 min-h-[150px] text-center transition-all hover:bg-[#e8f8ff]"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-3">✅ Done</h3>
        {doneTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">Drag tasks here when completed.</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className={`${task.color} w-72 shadow-md rounded-xl p-4 transition`}
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h4>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasksBoard;
