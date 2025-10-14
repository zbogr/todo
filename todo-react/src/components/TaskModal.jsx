// TaskModal.jsx
import React, {useEffect, useState} from "react";

export default function TaskModal({task, closeTask, updateTask}) {
	// Локальна копія, щоб не мутувати пропси напряму
	const [local, setLocal] = useState({...task});

	useEffect(() => {
		// якщо task змінився зовні — оновимо локальну копію
		setLocal({...task});
	}, [task]);

	// Додавання підпункту
	const addSubtask = (text) => {
		const t = text.trim();
		if (!t) return;
		const updated = {
			...local,
			subtasks: [
				...(local.subtasks || []),
				{id: Date.now().toString(), text: t, completed: false},
			],
		};
		setLocal(updated);
		updateTask(updated);
	};

	// Перемкнути completed підпункту
	const toggleSubtask = (subId) => {
		const updated = {
			...local,
			subtasks: (local.subtasks || []).map((s) =>
				s.id === subId ? {...s, completed: !s.completed} : s
			),
		};
		setLocal(updated);
		updateTask(updated);
	};

	// Видалити підпункт
	const deleteSubtask = (subId) => {
		const updated = {
			...local,
			subtasks: (local.subtasks || []).filter((s) => s.id !== subId),
		};
		setLocal(updated);
		updateTask(updated);
	};

	// Оновити title або project (детальніша редагування)
	const changeField = (field, value) => {
		const updated = {...local, [field]: value};
		setLocal(updated);
		// Ми не робимо PUT на кожну клавішу — but тут зробимо одразу для синхронності
		updateTask(updated);
	};

	// Поле додавання підпункту
	const [newSub, setNewSub] = useState("");

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
			<div className="bg-white rounded-xl shadow-2xl w-[480px] p-5 animate-fade-in max-h-[80vh] overflow-auto">
				<div className="flex justify-between items-center mb-3">
					<input
						value={local.title}
						onChange={(e) => changeField("title", e.target.value)}
						className="text-lg font-semibold w-full border-b px-1 py-0.5"
					/>
					<button onClick={closeTask} className="ml-3 text-gray-500 hover:text-gray-800">
						✖
					</button>
				</div>

				{/* Кнопка зміни проекту */}
				<div className="mb-4">
					<label className="text-sm text-gray-500 mr-2">Проєкт:</label>
					<input
						value={local.project}
						onChange={(e) => changeField("project", e.target.value)}
						className="border rounded px-2 py-1"
					/>
					<p className="text-xs text-gray-400 mt-1">Зміни проекту збережуться автоматично.</p>
				</div>

				<div className="mb-4">
					<h3 className="text-sm font-medium mb-2">Підпункти</h3>
					<div className="space-y-2 max-h-56 overflow-y-auto pr-2">
						{(local.subtasks || []).map((s) => (
							<div
								key={s.id}
								className="flex items-center justify-between bg-gray-50 p-2 rounded">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={s.completed}
										onChange={() => toggleSubtask(s.id)}
									/>
									<span className={s.completed ? "line-through text-gray-400" : ""}>
										{s.text}
									</span>
								</div>
								<div className="flex gap-2">
									<button onClick={() => deleteSubtask(s.id)} className="text-red-500">
										🗑
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex gap-2">
					<input
						placeholder="Новий підпункт..."
						value={newSub}
						onChange={(e) => setNewSub(e.target.value)}
						className="flex-1 border rounded px-2 py-1"
						onKeyDown={(e) => e.key === "Enter" && (addSubtask(newSub), setNewSub(""))}
					/>
					<button
						onClick={() => {
							addSubtask(newSub);
							setNewSub("");
						}}
						className="bg-indigo-600 text-white px-3 rounded">
						Додати
					</button>
				</div>

				<div className="mt-4 text-right">
					<button onClick={closeTask} className="text-sm px-3 py-1 bg-gray-100 rounded">
						Закрити
					</button>
				</div>
			</div>
		</div>
	);


}
