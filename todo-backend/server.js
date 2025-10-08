import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Тимчасові дані (поки без бази)
let tasks = [
  { id: 1, text: "Перше завдання", completed: false, project: "default" },
];

// --- ROUTES ---
app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.map((t) => (t.id == id ? { ...t, ...req.body } : t));
  res.json({ message: "Task updated" });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id != id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
