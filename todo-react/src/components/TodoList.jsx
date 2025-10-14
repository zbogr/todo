// TodoList.jsx
import React, {useState} from "react";

export default function TodoList({tasks, onToggle, onDelete, onEditTitle, openTask}) {
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");

	const startEdit = (task) => {
		setEditingId(task.id);
		setEditText(task.title);
	};

	const saveEdit = (id) => {
		const val = editText.trim();
		if (!val) return;
		onEditTitle(id, val);
		setEditingId(null);
		setEditText("");
	};

	return (
		<div className="space-y-2">
			{tasks.length === 0 && <p className="text-gray-500">Немає завдань у цьому проєкті</p>}
			{tasks.map((task) => (
				<div key={task.id} className="flex items-center justify-between p-2 border rounded">
					<div className="flex items-center gap-3 flex-1">
						<input
							type="checkbox"
							checked={task.completed || false}
							onChange={() => onToggle(task.id)}
							className="h-4 w-4"
						/>

						{editingId === task.id ? (
							<input
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								onBlur={() => saveEdit(task.id)}
								onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
								autoFocus
								className="flex-1 border-b outline-none"
							/>
						) : (
							<span
								onClick={() => openTask(task)} // відкриває модалку
								className={`flex-1 cursor-pointer ${
									task.completed ? "line-through text-gray-400" : ""
								}`}>
								{task.title}
							</span>
						)}
					</div>

					<div className="flex gap-2 items-center">
						<button
							onClick={() => startEdit(task)}
							className="text-sm text-indigo-600 hover:underline">
							✏️
						</button>
						<button
							onClick={() => onDelete(task.id)}
							className="text-sm text-red-500 hover:underline">
							🗑
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
