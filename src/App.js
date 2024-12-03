import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");  // Success message state

  const apiUrl = "https://backend-assignment-zw78.onrender.com/api/todos";
 // Ensure fallback for local testing

  // Memoize the fetchTasks function using useCallback
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(apiUrl);
      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("Fetched tasks are not in expected array format", response.data);
        setTasks([]); // Fallback to an empty array if not an array
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
      setTasks([]);  // Fallback to an empty array in case of error
    }
  }, [apiUrl]); // Dependencies of fetchTasks

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);  // Use fetchTasks as a dependency

  const addTask = async () => {
    if (!taskText.trim()) {
      return; // Prevent adding an empty task
    }
    try {
      await axios.post(apiUrl, { 
        title: taskText, 
        description: taskDescription,
        completed: false
      });
      setTaskText("");  
      setTaskDescription(""); 
      setSuccessMessage("Task added successfully!"); 
      fetchTasks(); // Refresh the task list
      setTimeout(() => setSuccessMessage(""), 3000);  // Clear the message after 3 seconds
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/${taskId}`);
      fetchTasks();  // Refresh task list after deletion
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const updateTask = async (taskId) => {
    try {
      await axios.put(`${apiUrl}/${taskId}`, { 
        title: taskText, 
        description: taskDescription
      });
      setEditingTask(null);  // Clear the editing state
      setTaskText("");  // Clear the input field
      setTaskDescription(""); // Clear the description field
      fetchTasks();  // Refresh task list after update
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await axios.delete(`${apiUrl}/all`);
      fetchTasks();  // Refresh task list after deletion
    } catch (error) {
      console.error("Error deleting all tasks", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>

      {/* Success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="input-container">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task title"
          className="task-input"
        />
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description"
          className="task-input"
        />
        <button
          className="add-button"
          onClick={editingTask ? () => updateTask(editingTask) : addTask}
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Display list of tasks */}
      <ul className="task-list">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <div className="task-actions">
                {/* Edit Button */}
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditingTask(task.id);
                    setTaskText(task.title);  // Populate input field with task title for editing
                    setTaskDescription(task.description); // Populate description for editing
                  }}
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks available</p>  // Message when no tasks are available
        )}
      </ul>

      {/* Button to delete all tasks */}
      <button className="delete-all-button" onClick={deleteAllTasks}>
        Delete All Tasks
      </button>
    </div>
  );
}

export default App;
