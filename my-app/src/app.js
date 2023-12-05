import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { createTodo, readTodos, updateTodo, deleteTodo } from './api';
import { addTodoInTodos, findTodo, removeTodoInTodos, setTodoInTodos } from './utils';
import { ControlPanel } from './components';
import { NEW_TODO_ID } from './constants';
import { Routes, Route, Link, Outlet, useParams } from 'react-router-dom';
import { TaskListPage, ErrorPage } from './pages';
import { Task } from './pages/task/task';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isAlphabetSorting, setIsAlphabetSorting] = useState(false);

	const onTodoAdd = () => {
		setTodos(addTodoInTodos(todos));
	};

	const onTodoSave = (todoId) => {
		const { title, completed } = findTodo(todos, todoId) || {};

		if (todoId === NEW_TODO_ID) {
			createTodo({ title, completed }).then((todo) => {
				let updatedTodos = setTodoInTodos(todos, {
					id: NEW_TODO_ID,
					isEditing: false,
				});
				updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
				updatedTodos = addTodoInTodos(updatedTodos, todo);

				setTodos(updatedTodos);
			});
		} else {
			updateTodo({ id: todoId, title }).then(() => {
				setTodos(setTodoInTodos(todos, { id: todoId, isEditing: false }));
			});
		}
	};

	useEffect(() => {
		readTodos(searchPhrase, isAlphabetSorting).then((loadedTodos) =>
			setTodos(loadedTodos),
		);
	}, [searchPhrase, isAlphabetSorting]);

	return (
		<div className={styles.app}>
			<ControlPanel
				onTodoAdd={onTodoAdd}
				onSearch={setSearchPhrase}
				onSorting={setIsAlphabetSorting}
			/>

			<Routes>
				<Route path="/" element={<TaskListPage />} />
				<Route path="/tasks" element={<TaskListPage />}>
					<Route path="task/:id" element={<Task />} />
				</Route>
				<Route path="/404" element={<ErrorPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</div>
	);
};
