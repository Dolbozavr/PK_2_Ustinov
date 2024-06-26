import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Запрос для получения списка задач
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(tasksData => {
        // Запрос для получения списка пользователей
        fetch('https://jsonplaceholder.typicode.com/users')
          .then(response => response.json())
          .then(usersData => {
            // Обработка данных и добавление информации о пользователе к каждой задаче
            const tasksWithUsers = tasksData.map(task => {
              const user = usersData.find(user => user.id === task.userId);
              return { ...task, user: user };
            });
            // Устанавливаем полученные данные в состояние tasks
            setTasks(tasksWithUsers);
          })
          .catch(error => console.error('Error fetching users:', error));
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = (text) => {
    if (text.trim() !== "") {
      setTasks([{ id: tasks.length, title: text, completed: false }, ...tasks]);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditTaskText(taskText);
  };

  const saveEdit = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editTaskText } : task
    ));
    setEditTaskId(null);
    setEditTaskText("");
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") {
      return !task.completed;
    } else if (filter === "completed") {
      return task.completed;
    } else {
      return true;
    }
  });

  return (
    <div className="todoapp stack-large">
      <h1>ТуДу'шка</h1>
      <form onSubmit={(e) => { e.preventDefault(); addTask(e.target.elements[0].value); e.target.reset(); }}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            Что пользователи сделали
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Добавить
        </button>
      </form>
      <div className="filters btn-group stack-exception">
        <button type="button" className={`btn toggle-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter("all")}>
          <span className="visually-hidden">Show </span>
          <span>Все</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter("active")}>
          <span className="visually-hidden">Show </span>
          <span>Активные</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter("completed")}>
          <span className="visually-hidden">Show </span>
          <span>Выполненные</span>
          <span className="visually-hidden"> tasks</span>
        </button>
      </div>
      <h2 id="list-heading">Невыполненные: {tasks.filter(task => !task.completed).length}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {filteredTasks.map(task => (
          <li key={task.id} className="todo stack-small">
            <div className="c-cb">
              <input
                id={`todo-${task.id}`}
                type="checkbox"
                defaultChecked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <label className="todo-label" htmlFor={`todo-${task.id}`}>
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                ) : (
                  <>
                    {task.title}
                    {task.user && <span>({task.user.name})</span>}
                  </>
                )}
              </label>
            </div>
            <div className="btn-group">
              {editTaskId === task.id ? (
                <>
                  <button type="button" className="btn" onClick={() => saveEdit(task.id)}>
                    Сохранить
                  </button>
                  <button type="button" className="btn btn__danger" onClick={() => setEditTaskId(null)}>
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn" onClick={() => editTask(task.id, task.title)}>
                    Изменить
                  </button>
                  <button type="button" className="btn btn__danger" onClick={() => deleteTask(task.id)}>
                    Удалить
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
