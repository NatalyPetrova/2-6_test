import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Task } from './task/task';
import styles from '../app.module.css';

export const TaskListPage = (
	onTodoEdit,
	onTodoTitleChange,
	onTodoCompletedChange,
	onTodoSave,
	onTodoRemove,
) => {
	const [tasks, setTasks] = useState([]);
	const [newTaskText, setNewTaskText] = useState('');
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		// Загрузка списка задач с сервера
		fetch('http://localhost:3003/tasks')
			.then((response) => response.json())
			.then((data) => setTasks(data));
	}, []);

	const addTask = () => {
		// Добавление новой задачи
		fetch('http://localhost:3003/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: newTaskText }),
		})
			.then((response) => response.json())
			.then((newTask) => {
				setTasks([...tasks, newTask]);
				setNewTaskText('');
			});
	};

	const filteredTasks = tasks.filter((task) =>
		task.title.toLowerCase().includes(searchText.toLowerCase()),
	);

	return (
		<div>
			<div>
				<input
					type="text"
					value={newTaskText}
					onChange={(e) => setNewTaskText(e.target.value)}
					placeholder="Новая задача"
				/>
				<button onClick={addTask}>Добавить задачу</button>
			</div>
			<div>
				<ul>
					{filteredTasks.map(({ id, title, completed, isEditing = false }) => (
						<NavLink to={`task/${id}`}>
							<Task
								key={id}
								id={id}
								title={title}
								completed={completed}
								isEditing={isEditing}
								onEdit={() => onTodoEdit(id)}
								onTitleChange={(newTitle) =>
									onTodoTitleChange(id, newTitle)
								}
								onCompletedChange={(newCompleted) =>
									onTodoCompletedChange(id, newCompleted)
								}
								onSave={() => onTodoSave(id)}
								onRemove={() => onTodoRemove(id)}
							/>
						</NavLink>
					))}
				</ul>
				<Outlet />
			</div>
		</div>
	);
};

export default TaskListPage;
