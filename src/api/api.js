import { makePreparedTasksModel } from '../helpers/todoHelpers';

const apiUrl = process.env.REACT_APP_DB_URL;

export const getTodosFromServer = () => fetch(`${apiUrl}/tasks.json`)
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }

    throw new Error('Error getting todos');
  })
  .catch((error) => {
    throw new Error(error.message);
  });

// eslint-disable-next-line space-before-function-paren
export const postTodo = todo => fetch(`${apiUrl}/tasks.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(todo),
});

export const deleteTask = taskId => fetch(`${apiUrl}/tasks/${taskId}.json`, {
  method: 'DELETE',
});

export const changeTaskCompletement = (
  taskId,
  todos,
) => fetch(`${apiUrl}/tasks/${taskId}.json`, {
  method: 'PATCH',
  body: JSON.stringify({
    isCompleted: !(todos.find(todo => todo.id === taskId)).isCompleted,
  }),
})
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }

    throw new Error('Not changed');
  })
  .catch((error) => {
    throw new Error(error);
  });

export const completeAllTasks = (todos, isAllCompleted) => {
  const preparedTasksModel = makePreparedTasksModel(
    todos,
    true,
    isAllCompleted,
  );

  return fetch(`${apiUrl}/tasks.json`, {
    method: 'PATCH',
    body: JSON.stringify(preparedTasksModel),
  });
};

export const deleteCompletedTasks = (todos) => {
  const completedTodos = todos.filter(todo => todo.isCompleted === true);

  completedTodos.forEach((todo) => {
    fetch(`${apiUrl}/tasks/${todo.id}.json`, {
      method: 'DELETE',
    });
  });
};

export const sendChangedTaskTitle = changedTask => (
  fetch(`${apiUrl}/tasks/${changedTask.id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ title: changedTask.title }),
  }));
