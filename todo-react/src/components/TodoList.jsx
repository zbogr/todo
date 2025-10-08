import React from "react";

export default function TodoList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0)
    return <p className="text-gray-500 text-center">Немає завдань 💤</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center border p-2 rounded-lg hover:bg-gray-50 transition"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggle(task.id, e.target.checked)}
              className="h-4 w-4"
            />
            <span
              className={
                "text-gray-800 " + (task.completed ? "line-through text-gray-400" : "")
              }
            >
              {task.text}
            </span>
          </label>

          <button
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Видалити
          </button>
        </li>
      ))}
    </ul>
  );
}
