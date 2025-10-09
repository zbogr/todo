import React, { useState } from "react";

export default function ProjectSelector({ projects, current, onSelect, onAdd }) {
  const [newProject, setNewProject] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProject.trim()) return;
    onAdd(newProject);
    setNewProject("");
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {projects.map((project) => (
          <button
            key={project}
            onClick={() => onSelect(project)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              project === current
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {project}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Новий проєкт..."
          className="flex-grow border rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600"
        >
          +
        </button>
      </form>
    </div>
  );
}
