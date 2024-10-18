// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: "",
    quadrant: "urgentImportant",
  });

  const handleInputChange = (event) => {
    setNewTask({ ...newTask, text: event.target.value });
  };

  const handleQuadrantChange = (event) => {
    setNewTask({ ...newTask, quadrant: event.target.value });
  };

  const addTask = () => {
    setTasks([...tasks, newTask]);
    setNewTask({ text: "", quadrant: "urgentImportant" });
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <div className="app-container">
      <h1>Eisenhower Matrix</h1>
      <div className="input-area">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTask.text}
          onChange={handleInputChange}
        />
        <select value={newTask.quadrant} onChange={handleQuadrantChange}>
          <option value="urgentImportant">Urgent & Important</option>
          <option value="notUrgentImportant">Not Urgent & Important</option>
          <option value="urgentNotImportant">Urgent & Not Important</option>
          <option value="notUrgentNotImportant">
            Not Urgent & Not Important
          </option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="matrix-container">
        <div className="matrix-quadrant">
          <h2>Urgent & Important (Do First)</h2>
          <ul>
            {tasks
              .filter((task) => task.quadrant === "urgentImportant")
              .map((task, index) => (
                <li key={index}>
                  {task.text}
                  <button onClick={() => deleteTask(index)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
        <div className="matrix-quadrant">
          <h2>Not Urgent & Important (Schedule)</h2>
          <ul>
            {tasks
              .filter((task) => task.quadrant === "notUrgentImportant")
              .map((task, index) => (
                <li key={index}>
                  {task.text}
                  <button onClick={() => deleteTask(index)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
        <div className="matrix-quadrant">
          <h2>Urgent & Not Important (Delegate)</h2>
          <ul>
            {tasks
              .filter((task) => task.quadrant === "urgentNotImportant")
              .map((task, index) => (
                <li key={index}>
                  {task.text}
                  <button onClick={() => deleteTask(index)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
        <div className="matrix-quadrant">
          <h2>Not Urgent & Not Important (Eliminate)</h2>
          <ul>
            {tasks
              .filter((task) => task.quadrant === "notUrgentNotImportant")
              .map((task, index) => (
                <li key={index}>
                  {task.text}
                  <button onClick={() => deleteTask(index)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="insights">
        <h2>Time Management Insights</h2>
        <p>
          Based on your task distribution, you can focus on completing the
          "Urgent & Important" tasks first. Schedule time for "Not Urgent &
          Important" tasks to prevent them from becoming urgent. Consider
          delegating "Urgent & Not Important" tasks if possible. Try to
          eliminate or minimize "Not Urgent & Not Important" tasks to free up
          more time.
        </p>
      </div>
    </div>
  );
}

export default App;
