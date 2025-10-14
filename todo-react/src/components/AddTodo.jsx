// AddTodo.jsx
import React, {useState} from "react";

export default function AddTodo({onAdd}) {
	const [text, setText] = useState("");

	const submit = (e) => {
		e.preventDefault();
		const t = text.trim();
		if (!t) return;
		onAdd(t);
		setText("");
	};

	return (
		<form onSubmit={submit} className="flex gap-2 mb-4">
			<input
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Нова задача..."
				className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring"
			/>
			<button type="submit" className="bg-indigo-600 text-white px-4 rounded">
				Додати
			</button>
		</form>
	);
}
