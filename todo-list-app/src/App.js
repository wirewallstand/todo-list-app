import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setNewTaskPriority(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setNewTaskDueDate(e.target.value);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/tasks',
          { text: newTask, priority: newTaskPriority, dueDate: newTaskDueDate },
          { headers: { Authorization: token } }
        );
        setTasks([...tasks, res.data]);
        setNewTask('');
        setNewTaskPriority('low');
        setNewTaskDueDate('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token },
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const task = tasks.find(task => task.id === id);
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updatedTask,
        { headers: { Authorization: token } }
      );
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (id, text, priority, dueDate) => {
    setEditTaskId(id);
    setEditTaskText(text);
    setNewTaskPriority(priority);
    setNewTaskDueDate(dueDate);
  };

  const handleEditInputChange = (e) => {
    setEditTaskText(e.target.value);
  };

  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        text: editTaskText,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        completed: false,
      };
      await axios.put(
        `http://localhost:5000/api/tasks/${editTaskId}`,
        updatedTask,
        { headers: { Authorization: token } }
      );
      setTasks(tasks.map(task =>
        task.id === editTaskId ? updatedTask : task
      ));
      setEditTaskId(null);
      setEditTaskText('');
      setNewTaskPriority('low');
      setNewTaskDueDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setToken(res.data.token);
      setIsAuthenticated(true);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sort === 'priority') {
      const priorities = { low: 1, medium: 2, high: 3 };
      return priorities[a.priority] - priorities[b.priority];
    }
    return 0;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>
      {!isAuthenticated ? (
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            placeholder="Add a new task"
          />
          <select value={newTaskPriority} onChange={handlePriorityChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={newTaskDueDate}
            onChange={handleDueDateChange}
          />
          <button onClick={handleAddTask}>Add Task</button>
          <div className="filter-sort">
            <label>
              Filter:
              <select value={filter} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </label>
            <label>
              Sort:
              <select value={sort} onChange={handleSortChange}>
                <option value="date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </label>
          </div>
          <ul>
            {sortedTasks.map(task => (
              <li key={task.id}>
                {editTaskId === task.id ? (
                  <div>
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={handleEditInputChange}
                    />
                    <select value={newTaskPriority} onChange={handlePriorityChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={handleDueDateChange}
                    />
                    <button onClick={handleUpdateTask}>Update</button>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                      onClick={() => handleToggleComplete(task.id)}
                    >
                      {task.text} ({task.priority}) - {task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : 'No due date'}
                    </span>
                    <button onClick={() => handleEditTask(task.id, task.text, task.priority, task.dueDate)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
