import React from "react";
import TodoApp from "./components/TodoApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-9/10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">ToDo (React + Node)</h1>
        </header>
        <TodoApp />
      </div>
    </div>
  );
}
