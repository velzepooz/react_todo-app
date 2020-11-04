export const makePreparedTasksModel = (tasks, isCompleted) => {
  const firebaseTaskModel = {};

  if (isCompleted) {
    tasks.forEach((todo) => {
      firebaseTaskModel[todo.id] = {
        isCompleted: !isCompleted, title: todo.title,
      };
    });
  } else {
    tasks.forEach((todo) => {
      firebaseTaskModel[todo.id] = {
        isCompleted: todo.isCompleted, title: todo.title,
      };
    });
  }

  return firebaseTaskModel;
};

export const makeArrayFromTasksModel = (model) => {
  const tempArray = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(model)) {
    tempArray.push({
      id: key, ...value,
    });
  }

  return tempArray;
};
