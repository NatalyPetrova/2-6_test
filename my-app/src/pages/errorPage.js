import React from 'react';

export const ErrorPage = ({ code }) => {
	return (
		<div>
			<h1>Ошибка {code}</h1>
			<h2>Страница не найдена</h2>
		</div>
	);
};
