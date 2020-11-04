import React from 'react';
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
} from '../../api/api';

export class TodoApp extends React.Component {
  state = {
    todos: [],
    allCompleted: [],
    isCompleted: true,
  }

  componentDidMount() {
    getTodosFromServer()
      .then((data) => {
        const tempArray = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(data)) {
          tempArray.push({
            id: key, ...value,
          });
        }

        this.setState({
          todos: [...tempArray],
          allCompleted: tempArray.every(todo => todo.isCompleted === true),
        });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  // eslint-disable-next-line space-before-function-paren
  addTodo = async (taskTitle) => {
    const newTodo = {
      title: taskTitle,
      isCompleted: false,
    };

    try {
      const result = await postTodo(newTodo);
      const data = await result.json();

      newTodo.id = data.name;

      this.setState(prevState => ({
        todos: [
          ...prevState.todos,
          { ...newTodo },
        ],
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  deleteTodo = (taskId) => {
    deleteTask(taskId)
      .then((response) => {
        if (response.status === 200) {
          this.setState(prevState => (
            {
              todos: prevState.todos.filter(todo => todo.id !== taskId),
            }));
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  // eslint-disable-next-line space-before-function-paren
  changeCompletement = async (taskId) => {
    try {
      const result = await changeTaskCompletement(taskId, this.state.todos);

      if (result) {
        this.setState(prevState => ({
          todos: prevState.todos.map((todo) => {
            if (todo.id !== taskId) {
              return todo;
            }

            return {
              ...todo,
              isCompleted: !todo.isCompleted,
            };
          }),
        }));

        this.checkCompletement();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  completeAll = () => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo => ({
        ...todo,
        isCompleted: !prevState.allCompleted,
      })),
      allCompleted: !prevState.allCompleted,
    }));
  }

  checkCompletement = () => {
    this.setState(prevState => ({
      allCompleted: prevState.todos.every(todo => (
        todo.isCompleted === true
      )),
    }));
  }

  clearCompleted = () => {
    this.setState(prevState => (
      {
        todos: prevState.todos.filter(todo => todo.isCompleted !== true),
      }));
  }

  taskCounter = (isComplited) => {
    let counter = 0;

    this.state.todos.forEach((todo) => {
      if (todo.isCompleted === isComplited) {
        counter += 1;
      }
    });

    return counter;
  }

  changeTodo = (taskId, newTitle) => {
    this.setState(prevState => ({
      todos: prevState.todos.map((todo) => {
        if (todo.id !== taskId) {
          return todo;
        }

        return {
          ...todo,
          title: newTitle,
        };
      }),
    }));
  }

  render() {
    const activeTaskQuantity = this.taskCounter(!this.state.isCompleted);
    const completedTaskQuantity = this.taskCounter(this.state.isCompleted);
    const taskQuantity = this.state.todos.length;

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <AddForm
            addTodo={this.addTodo}
          />
        </header>

        <section className="main">
          <CompleteAllCheckbox completeAll={this.completeAll} />
          <Route
            path="/"
            render={({ location }) => (
              <TodoList
                changeTodo={this.changeTodo}
                location={location}
                deleteTodo={this.deleteTodo}
                todos={this.state.todos}
                completeTodo={this.changeCompletement}
              />
            )}
          />
        </section>
        {!!taskQuantity
          && (
            <footer className="footer">
              <TodoMenu
                activeTasks={activeTaskQuantity}
                clearCompleted={this.clearCompleted}
                completedTasks={completedTaskQuantity}
              />
            </footer>
          )
        }
      </section>
    );
  }
}

TodoApp.propTypes = TodoAppShapes;
