import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setNewTaskPriority(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setNewTaskDueDate(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, priority: newTaskPriority, dueDate: newTaskDueDate, completed: false }]);
      setNewTask('');
      setNewTaskPriority('low');
      setNewTaskDueDate('');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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

  const handleUpdateTask = () => {
    setTasks(tasks.map(task =>
      task.id === editTaskId ? { ...task, text: editTaskText, priority: newTaskPriority, dueDate: newTaskDueDate } : task
    ));
    setEditTaskId(null);
    setEditTaskText('');
    setNewTaskPriority('low');
    setNewTaskDueDate('');
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
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
      <ul>
        {tasks.map(task => (
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
  );
}

export default App;
