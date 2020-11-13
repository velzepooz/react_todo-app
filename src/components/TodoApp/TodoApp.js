/* eslint-disable no-console */
/* eslint-disable space-before-function-paren */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Route } from 'react-router-dom';
import { TodoAppShapes } from '../../Shapes/Shapes';
import { AddForm } from '../AddForm/AddForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoMenu } from '../TodoMenu/TodoMenu';
import { CompleteAllCheckbox }
  from '../CompleteAllCheckbox/CompleteAllCheckbox';
import {
  postTodo,
  getTodosFromServer,
  deleteTask,
  changeTaskCompletement,
  completeAllTasks,
  deleteCompletedTasks,
  sendChangedTaskTitle,
} from '../../api/api';
import { makeArrayFromTasksModel } from '../../helpers/todoHelpers';

export const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  useEffect(() => {
    // TODO: Make loader
    getTodosFromServer()
      .then((data) => {
        if (data) {
          const tempArray = makeArrayFromTasksModel(data);

          setTodos(tempArray);
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, []);

  const checkIsAllTodosCompleted = useCallback(() => {
    setIsAllCompleted(() => {
      todos.every(todo => todo.isCompleted === true);
    });
  }, [todos, setIsAllCompleted]);

  const countTodosByStatus = useCallback((isCompleted) => {
    let counter = 0;

    if (todos) {
      todos.forEach((todo) => {
        if (todo.isCompleted === isCompleted) {
          counter += 1;
        }
      });
    }

    return counter;
  }, [todos]);

  const addNewTodo = useCallback(async (taskTitle) => {
    const newTodo = {
      title: taskTitle,
      isCompleted: false,
    };

    try {
      const result = await postTodo(newTodo);
      const data = await result.json();

      newTodo.id = data.name;
      setTodos(prevTodos => [...prevTodos, { ...newTodo }]);
    } catch (error) {
      throw new Error(error.message);
    }
  }, [setTodos]);

  const deleteTodo = useCallback(async (taskId) => {
    // TODO: Prepare task before sending
    deleteTask(taskId)
      .then((response) => {
        if (response.status === 200) {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [setTodos]);

  const changeTodoCompletement = useCallback(async (taskId) => {
    // TODO: prepare data for sending
    try {
      const result = await changeTaskCompletement(taskId, todos);

      if (result) {
        setTodos(prevTodos => prevTodos.map((todo) => {
          if (todo.id !== taskId) {
            return todo;
          }

          return {
            ...todo,
            isCompleted: !todo.isCompleted,
          };
        }));

        checkIsAllTodosCompleted();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [todos, setTodos, checkIsAllTodosCompleted]);

  const completeAllTodos = useCallback(async() => {
    // TODO: prepare before sending
    try {
      const response = completeAllTasks(todos, isAllCompleted);

      if (response) {
        setTodos(prevTodos => prevTodos.map(todo => ({
          ...todo,
          isCompleted: !isAllCompleted,
        })));
        setIsAllCompleted(prevCompleted => !prevCompleted);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [todos, setTodos, isAllCompleted, setIsAllCompleted]);

  const deleteCompletedTodos = useCallback(() => {
    // TODO: Prepare todos
    deleteCompletedTasks(todos);

    setTodos(prevTodos => prevTodos.filter(todo => todo.isCompleted !== true));
  }, [todos, setTodos]);

  const editTodoTitle = useCallback((taskId, newTitle) => {
    // TODO: make async
    const changedTask = {
      ...todos.find(todo => todo.id === taskId),
      title: newTitle,
    };

    sendChangedTaskTitle(changedTask)
      .then(response => console.log(response))
      .catch(error => console.log(error));

    setTodos(prevTodos => prevTodos.map((todo) => {
      if (todo.id !== taskId) {
        return todo;
      }

      return {
        ...todo,
        title: newTitle,
      };
    }));
  }, [todos, setTodos]);

  const activeTaskQuantity = countTodosByStatus(false);
  const completedTaskQuantity = countTodosByStatus(true);
  const taskQuantity = useMemo(() => todos.length, [todos]);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <AddForm
          addNewTodo={addNewTodo}
        />
      </header>

      <section className="main">
        <CompleteAllCheckbox completeAll={completeAllTodos} />
        <Route
          path="/"
          render={({ location }) => (
            <TodoList
              changeTodo={editTodoTitle}
              location={location}
              deleteTodo={deleteTodo}
              todos={todos}
              changeTodoCompletement={changeTodoCompletement}
            />
          )}
        />
      </section>
      {!!taskQuantity
      && (
        <footer className="footer">
          <TodoMenu
            activeTasks={activeTaskQuantity}
            clearCompleted={deleteCompletedTodos}
            completedTasks={completedTaskQuantity}
          />
        </footer>
      )
      }
    </section>
  );
};
// export class TodoApp extends React.Component {
//   state = {
//     todos: [],
//     allCompleted: [],
//     isCompleted: true,
//   }

// componentDidMount() {
//   // TODO: Make loader
//   getTodosFromServer()
//     .then((data) => {
//       if (data) {
//         const tempArray = makeArrayFromTasksModel(data);

//         this.setState({
//           todos: [...tempArray],
//           allCompleted: tempArray.every(todo => todo.isCompleted === true),
//         });
//       }
//     })
//     .catch((error) => {
//       throw new Error(error.message);
//     });
// }

// eslint-disable-next-line space-before-function-paren
// addTodo = async (taskTitle) => {
//   const newTodo = {
//     title: taskTitle,
//     isCompleted: false,
//   };

//   try {
//     const result = await postTodo(newTodo);
//     const data = await result.json();

//     newTodo.id = data.name;

//     this.setState(prevState => ({
//       todos: [
//         ...prevState.todos,
//         { ...newTodo },
//       ],
//     }));
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// TODO: Make async
// deleteTodo = (taskId) => {
//   deleteTask(taskId)
//     .then((response) => {
//       if (response.status === 200) {
//         this.setState(prevState => (
//           {
//             todos: prevState.todos.filter(todo => todo.id !== taskId),
//           }));
//       }
//     })
//     .catch((error) => {
//       throw new Error(error.message);
//     });
// }

// eslint-disable-next-line space-before-function-paren
// changeCompletement = async (taskId) => {
//   try {
//     const result = await changeTaskCompletement(taskId, this.state.todos);

//     if (result) {
//       this.setState(prevState => ({
//         todos: prevState.todos.map((todo) => {
//           if (todo.id !== taskId) {
//             return todo;
//           }

//           return {
//             ...todo,
//             isCompleted: !todo.isCompleted,
//           };
//         }),
//       }));

//       this.#checkCompletement();
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// completeAll = async() => {
//   try {
//     const response = completeAllTodos(
//       this.state.todos,
//       this.state.allCompleted,
//     );

//     if (response) {
//       this.setState(prevState => ({
//         todos: prevState.todos.map(todo => ({
//           ...todo,
//           isCompleted: !prevState.allCompleted,
//         })),
//         allCompleted: !prevState.allCompleted,
//       }));
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// eslint-disable-next-line react/sort-comp
// #checkCompletement = () => {
//   this.setState(prevState => ({
//     allCompleted: prevState.todos.every(todo => (
//       todo.isCompleted === true
//     )),
//   }));
// }

// clearCompleted = () => {
//   deleteCompletedTasks(this.state.todos);

//   this.setState(prevState => (
//     {
//       todos: prevState.todos.filter(todo => todo.isCompleted !== true),
//     }));
// }

// taskCounter = (isComplited) => {
//   let counter = 0;

//   this.state.todos.forEach((todo) => {
//     if (todo.isCompleted === isComplited) {
//       counter += 1;
//     }
//   });

//   return counter;
// }

// changeTodo = (taskId, newTitle) => {
//   const { todos } = this.state;

//   const changedTask = {
//     ...todos.find(todo => todo.id === taskId),
//     title: newTitle,
//   };

//   sendChangedTaskTitle(changedTask)
//     .then(response => console.log(response))
//     .catch(error => console.log(error));

//   this.setState(prevState => ({
//     todos: prevState.todos.map((todo) => {
//       if (todo.id !== taskId) {
//         return todo;
//       }

//       return {
//         ...todo,
//         title: newTitle,
//       };
//     }),
//   }));
// }

//   render() {
//     const activeTaskQuantity = this.taskCounter(!this.state.isCompleted);
//     const completedTaskQuantity = this.taskCounter(this.state.isCompleted);
//     const taskQuantity = this.state.todos.length;

//     return (
//       <section className="todoapp">
//         <header className="header">
//           <h1>todos</h1>
//           <AddForm
//             addTodo={this.addTodo}
//           />
//         </header>

//         <section className="main">
//           <CompleteAllCheckbox completeAll={this.completeAll} />
//           <Route
//             path="/"
//             render={({ location }) => (
//               <TodoList
//                 changeTodo={this.changeTodo}
//                 location={location}
//                 deleteTodo={this.deleteTodo}
//                 todos={this.state.todos}
//                 completeTodo={this.changeCompletement}
//               />
//             )}
//           />
//         </section>
//         {!!taskQuantity
//           && (
//             <footer className="footer">
//               <TodoMenu
//                 activeTasks={activeTaskQuantity}
//                 clearCompleted={this.clearCompleted}
//                 completedTasks={completedTaskQuantity}
//               />
//             </footer>
//           )
//         }
//       </section>
//     );
//   }
// }

TodoApp.propTypes = TodoAppShapes;
