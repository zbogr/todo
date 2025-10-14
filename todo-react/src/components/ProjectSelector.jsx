

function ProjectSelector({ projects, activeProject, setActiveProject, deleteProject }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {projects.map((project) => (
        <div
          key={project}
          className={`flex items-center gap-2 px-3 py-1 mb-2 rounded border cursor-pointer transition ${
            activeProject === project ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          {/* ✅ Клік по назві — вибір проєкту */}
          <span onClick={() => setActiveProject(project)}>{project}</span>

          {/* 🗑 Кнопка видалення проєкту */}
          <button
            onClick={() => deleteProject(project)}
            className="text-gray-400 hover:text-red-500 transition"
            title="Видалити проєкт"
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectSelector;

