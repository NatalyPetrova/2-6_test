import { useParams } from 'react-router-dom';
import { Button } from '../../components/button/button';
import styles from './task.module.css';
import { NavLink } from 'react-router-dom';
import { fetchServer } from '../../api/api';
import { ErrorPage } from '../errorPage';

export const Task = ({
	isEditing,
	onEdit,
	onCompletedChange,
	todos,
	setTodos,
	setTodoInTodos,
	updateTodo,
	deleteTodo,
	removeTodoInTodos,
}) => {
	const params = useParams();
	const task = fetchServer(params.id);

	if (!task) {
		return <ErrorPage />;
	}

	const { title, completed } = task;

	const onTodoEdit = (id) => {
		setTodos(setTodoInTodos(todos, { id, isEditing: true }));
	};

	const onTodoTitleChange = (id, newTitle) => {
		setTodos(setTodoInTodos(todos, { id, title: newTitle }));
	};

	const onTodoCompletedChange = (id, newCompleted) => {
		updateTodo({ id, completed: newCompleted }).then(() => {
			setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
		});
	};

	const onTodoRemove = (id) => {
		deleteTodo(id).then(() => setTodos(removeTodoInTodos(todos, id)));
	};

	return (
		<div className={styles.task}>
			<input
				className={styles.checkbox}
				type="checkbox"
				checked={completed}
				onChange={({ target }) => onCompletedChange(target.checked)}
			/>
			<div className={styles.title}>
				{isEditing ? (
					<input
						type="text"
						value={title}
						onChange={({ target }) => onTodoTitleChange(target.value)}
					/>
				) : (
					<div onClick={onEdit}>{title}</div>
				)}
			</div>
		</div>
	);
};
