// TodoApp.jsx
import React, {useEffect, useState} from "react";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import ProjectSelector from "./ProjectSelector";
import TaskModal from "./TaskModal";

const API = "http://localhost:4000/api";

export default function TodoApp() {
	const [tasks, setTasks] = useState([]);
	const [projects, setProjects] = useState(["default"]);
	const [currentProject, setCurrentProject] = useState("default");
	const [selectedTask, setSelectedTask] = useState(null);

	// Завантаження початкових даних: projects + tasks
	useEffect(() => {
		(async () => {
			try {
				const [prRes, tRes] = await Promise.all([
					fetch(`${API}/projects`),
					fetch(`${API}/tasks`),
				]);
				const prData = await prRes.json();
				const tData = await tRes.json();

				setProjects(prData || ["default"]);
				setTasks(tData || []);
				// Якщо в даних є задачі з іншими проектами — гарантовано підхопимо
				if (tData && tData.length > 0) {
					const p = tData[0].project || "default";
					setCurrentProject((prev) => (tData.some((t) => t.project === prev) ? prev : p));
				}
			} catch (err) {
				console.error("Помилка завантаження:", err);
			}
		})();
	}, []);

	// Додати проект (викликається з ProjectSelector)
	const addProject = async (name) => {
		name = name.trim();
		if (!name) return;
		try {
			const res = await fetch(`${API}/projects`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({name}),
			});
			const data = await res.json();
			setProjects(data);
			setCurrentProject(name);
		} catch (err) {
			console.error("Project create error:", err);
		}
	};

	// Додати задачу
	const addTask = async (title) => {
		const payload = {title, project: currentProject, subtasks: []};
		try {
			const res = await fetch(`${API}/tasks`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(payload),
			});
			const created = await res.json();
			setTasks((prev) => [...prev, created]);
		} catch (err) {
			console.error("Add task error:", err);
		}
	};

	// Toggle completed (зберігаємо повністю оновлений об'єкт на сервері)
	const toggleComplete = async (taskId) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;
		const updated = {...task, completed: !task.completed};
		try {
			await fetch(`${API}/tasks/${taskId}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(updated),
			});
			setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
		} catch (err) {
			console.error("Toggle error:", err);
		}
	};

	// Редагування заголовка (inline)
	const updateTitle = async (taskId, newTitle) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;
		const updated = {...task, title: newTitle};
		try {
			await fetch(`${API}/tasks/${taskId}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({title: newTitle}),
			});
			setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
			// якщо редагована task в модалці — синхронізуємо selectedTask
			if (selectedTask && selectedTask.id === taskId) setSelectedTask(updated);
		} catch (err) {
			console.error("Update title error:", err);
		}
	};

	// Видалити проєкт разом з усіма задачами, що до нього належать
	const deleteProject = async (projectName) => {
		// 1. Видаляємо із локального стейту список проектів
		setProjects((prev) => prev.filter((p) => p !== projectName));

		// 2. Видаляємо задачі по проєкту з локального стейту
		setTasks((prev) => prev.filter((task) => task.project !== projectName));

		// 3. Синхронізуємо з бекендом — DELETE проекту
		await fetch(`/api/projects/${projectName}`, {
			method: "DELETE",
		});

		// 4. Масове видалення задач на сервері
		await fetch(`/api/tasks/delete-by-project`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({project: projectName}),
		});
	};

	// Видалити задачу
	const deleteTask = async (taskId) => {
		try {
			await fetch(`${API}/tasks/${taskId}`, {method: "DELETE"});
			setTasks((prev) => prev.filter((t) => t.id !== taskId));
			if (selectedTask && selectedTask.id === taskId) setSelectedTask(null);
		} catch (err) {
			console.error("Delete error:", err);
		}
	};

	// Оновити задачу (отримує повний об'єкт updatedTask) — використовується модалкою
	const updateTask = async (updatedTask) => {
		try {
			const res = await fetch(`${API}/tasks/${updatedTask.id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(updatedTask),
			});
			const saved = await res.json();
			setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
			setSelectedTask(saved); // оновлюємо те, що відображено у модалці
			// якщо проект змінився — переконаймося, що він є в списку проектів
			if (saved.project && !projects.includes(saved.project))
				setProjects((p) => [...p, saved.project]);
		} catch (err) {
			console.error("Update task error:", err);
		}
	};

	// Відкрити модалку
	const openTask = (task) => {
		setSelectedTask(task);
	};

	// Закрити модалку
	const closeTask = () => {
		setSelectedTask(null);
	};

	// Фільтруємо задачі за поточним проектом
	const filteredTasks = tasks.filter((t) => (t.project || "default") === currentProject);

	return (
		<div className="bg-white p-6 rounded-2xl shadow-md">
			<ProjectSelector
				projects={projects}
				activeProject={currentProject}
				setActiveProject={setCurrentProject}
				deleteProject={deleteProject}
				onAdd={addProject}
			/>

			<AddTodo onAdd={addTask} />

			<TodoList
				tasks={filteredTasks}
				onToggle={toggleComplete}
				onDelete={deleteTask}
				onEditTitle={updateTitle}
				openTask={openTask}
			/>

			{selectedTask && (
				<TaskModal task={selectedTask} closeTask={closeTask} updateTask={updateTask} />
			)}
		</div>
	);
}
