// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// --- Початкові дані ---
// Ми зберігаємо tasks та projects в пам'яті (для простоти).
// У продакшні замінимо на БД (Mongo / Postgres).
let projects = ["default", "Робота", "Навчання"];
let tasks = [
	{
		id: Date.now().toString(),
		title: "Приклад задачі",
		completed: false,
		project: "default",
		subtasks: [
			{id: `${Date.now()}-1`, text: "Підпункт 1", completed: false},
			{id: `${Date.now()}-2`, text: "Підпункт 2", completed: true},
		],
	},
];

// --- PROJECTS routes ---
app.get("/api/projects", (req, res) => {
	res.json(projects);
});

app.post("/api/projects", (req, res) => {
	const name = (req.body?.name || "").trim();
	if (!name) return res.status(400).json({message: "Назва проекту потрібна"});
	if (!projects.includes(name)) {
		projects.push(name);
	}
	res.status(201).json(projects);
});

// --- TASKS routes ---
// Отримати всі задачі
app.get("/api/tasks", (req, res) => {
	res.json(tasks);
});

// Створити нову задачу
app.post("/api/tasks", (req, res) => {
	const body = req.body || {};
	const title = body.title || body.text || "Нова задача";
	const project = body.project || "default";

	// Якщо проект новий — додаємо його
	if (!projects.includes(project)) projects.push(project);

	const newTask = {
		id: Date.now().toString(),
		title,
		completed: false,
		project,
		subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
	};

	tasks.push(newTask);
	res.status(201).json(newTask);
});

// Оновити задачу (підпункти, title, completed, project тощо)
app.put("/api/tasks/:id", (req, res) => {
	const {id} = req.params;
	const index = tasks.findIndex((t) => t.id === id);
	if (index === -1) return res.status(404).json({message: "Задачу не знайдено"});

	// Мержимо існуючу задачу та те, що прийшло від клієнта.
	// ВАЖЛИВО: так збережуться project, subtasks, completed якщо вони були раніше.
	const updated = {...tasks[index], ...req.body};

	// Якщо project змінився і його ще немає в projects — додаємо
	if (updated.project && !projects.includes(updated.project)) {
		projects.push(updated.project);
	}

	tasks[index] = updated;
	res.json(updated);
});

// Видалити задачу
app.delete("/api/tasks/:id", (req, res) => {
	const {id} = req.params;
	const prevLen = tasks.length;
	tasks = tasks.filter((t) => t.id !== id);
	if (tasks.length === prevLen) return res.status(404).json({message: "Задачу не знайдено"});
	res.json({message: "Задача видалена"});
});

// Видалити проєкт (може зберігатись окремо або просто підтвердження)

// ✅ Видалення самого проєкту
app.delete("/api/projects/:name", (req, res) => {
	const projectName = req.params.name;
	projects = projects.filter((p) => p !== projectName); // якщо зберігаємо окремий список
	res.json({message: `Проєкт "${projectName}" видалено`});
});

// ✅ Масове видалення всіх задач, що належать до проєкту
app.post("/api/tasks/delete-by-project", (req, res) => {
	const {project} = req.body;
	tasks = tasks.filter((task) => task.project !== project);
	res.json({message: `Усі задачі проєкту "${project}" видалено`});
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}/api`));
