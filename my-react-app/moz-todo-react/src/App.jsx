import { useState } from "react";
import "./App.css";

function App(props) {
  console.log(props);
  const [tasks, setTasks] = useState([
    { id: 0, text: "Eat", completed: true },
    { id: 1, text: "Sleep", completed: false },
    { id: 2, text: "Repeat", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleChange = (event) => {
    setNewTaskText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTaskText.trim() !== "") {
      const newTask = {
        id: tasks.length,
        text: newTaskText,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <form onSubmit={handleSubmit}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
          value={newTaskText}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
      >
        {tasks.map(task => (
          <li key={task.id} className="todo stack-small">
            <div className="c-cb">
              <input
                id={`todo-${task.id}`}
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              />
              <label className="todo-label" htmlFor={`todo-${task.id}`}>
                {task.text}
              </label>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn"
                onClick={() => console.log("Edit task:", task.id)}
              >
                Edit <span className="visually-hidden">{task.text}</span>
              </button>
              <button
                type="button"
                className="btn btn__danger"
                onClick={() => deleteTask(task.id)}
              >
                Delete <span className="visually-hidden">{task.text}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
