import React, {useState} from "react";

export default function TodoList({ tasks, onToggle, onDelete, onEdit }) {

     const [editingId, setEditingId] = useState(null); // id задачі, яку редагуємо
  const [editText, setEditText] = useState("");     // текст, який редагуємо

  const handleEditStart = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleEditSave = async () => {
    if (editText.trim() === "") return;
    await onEdit(editingId, editText);
    setEditingId(null);
    setEditText("");
  };

  if (tasks.length === 0)
    return <p className="text-gray-500 text-center">Немає завдань 💤</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center border p-2 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggle(task.id, e.target.checked)}
              className="h-4 w-4"
            />


            {/* Якщо редагуємо цю задачу */}
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEditSave}             // коли фокус зникає — зберегти
                onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
                className="flex-grow border-b border-indigo-400 outline-none bg-transparent text-gray-700"
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={() => handleEditStart(task)}  // 👈 подвійний клік = редагування
                className={
                  "flex-grow cursor-text " +
                  (task.completed ? "line-through text-gray-400" : "text-gray-800")
                }
              >
                {task.text}
              </span>
            )}
          </div>

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
