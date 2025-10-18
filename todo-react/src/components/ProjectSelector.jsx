import React, {useState} from "react";

function ProjectSelector({onAdd, projects, activeProject, setActiveProject, deleteProject}) {

  const [newProject, setNewProject] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const name = newProject.trim();
    if (!name) return;
    onAdd(name);
    setNewProject("");
  };

	return (
		<div className="flex gap-2 flex-wrap max-w-xs mr-6">
			{projects.map((project) => (
				<div
					key={project}
					className={`flex flex-row items-center gap-2 px-3 py-1 mb-2 rounded border cursor-pointer transition ${
						activeProject === project ? "bg-blue-500 text-white" : "hover:bg-gray-100"
					}`}>
					{/* ✅ Клік по назві — вибір проєкту */}
					<span onClick={() => setActiveProject(project)}>{project}</span>

					{/* 🗑 Кнопка видалення проєкту */}
					<button
						onClick={() => deleteProject(project)}
						className="text-gray-400 hover:text-red-500 transition"
						title="Видалити проєкт">
						🗑
					</button>
				</div>
			))}
			<form onSubmit={handleAdd} className="flex gap-2">
				<input
					value={newProject}
					onChange={(e) => setNewProject(e.target.value)  }
					placeholder="Новий проект..."
					className="flex-1 border rounded px-2 py-0.5 focus:outline-none focus:ring"
				/>
				<button className="text-gray-600 hover:text-blue-500 transition">
					Додати
				</button>
			</form>
		</div>
	);
}

export default ProjectSelector;
