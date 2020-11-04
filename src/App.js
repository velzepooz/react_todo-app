import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TodoApp } from './components/TodoApp/TodoApp';

function App() {
  return (
    <section className="todoapp">
      <BrowserRouter basename="/react_todo-app/">
        <TodoApp />
      </BrowserRouter>
    </section>
  );
}

export default App;
