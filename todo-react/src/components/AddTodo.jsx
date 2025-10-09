import React, { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();           // не перезавантажує сторінку
    if (!text.trim()) return;     // пропускаємо пустий текст
    onAdd(text);                  // викликаємо функцію з батьківського компонента
    setText("");                  // очищаємо поле
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 text-gray-900">
      <input
        type="text"
        placeholder="Нова задача..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 rounded-r-lg hover:bg-indigo-600 transition"
      >
        Додати
      </button>
    </form>
  );
}
