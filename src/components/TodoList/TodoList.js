import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { TodosFilter } from '../TodosFilter/TodosFilter';

import { TodoListShapes } from '../../Shapes/Shapes';

export const TodoList = ({
  todos,
  deleteTodo,
  changeTodoCompletement,
  location,
  changeTodo,
}) => {
  const { pathname } = location;

  return (
    <ul className="todo-list">
      {pathname === '/'
        ? todos.map(todo => (
          <TodoItem
            key={todo.id}
            changeTodo={changeTodo}
            deleteTodo={deleteTodo}
            title={todo.title}
            id={todo.id}
            changeTodoCompletement={changeTodoCompletement}
            isCompleted={todo.isCompleted}
          />
        ))
        : (
          <TodosFilter
            todos={todos}
            deleteTodo={deleteTodo}
            changeTodoCompletement={changeTodoCompletement}
            changeTodo={changeTodo}
            pathname={pathname}
          />
        )
      }
    </ul>
  );
};

TodoList.propTypes = TodoListShapes;
