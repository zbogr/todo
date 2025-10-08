import React, { useState, useEffect } from "react";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);  // 🧠 масив усіх задач

  // 📡 1) Завантаження задач при старті
  useEffect(() => {
    fetch("http://localhost:4000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Помилка завантаження:", err));
  }, []);

  // ➕ 2) Функція для додавання нової задачі
  const addTask = async (text) => {
    const newTask = { text, completed: false, project: "default" };
    const res = await fetch("http://localhost:4000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const created = await res.json();
    setTasks([...tasks, created]);  // додаємо у стан
  };

  // ☑️ 3) Зміна статусу (completed)
  const toggleComplete = async (id, completed) => {
    await fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  // ❌ 4) Видалення задачі
  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
      <AddTodo onAdd={addTask} />
      <TodoList
        tasks={tasks}
        onToggle={toggleComplete}
        onDelete={deleteTask}
      />
    </div>
  );
}
