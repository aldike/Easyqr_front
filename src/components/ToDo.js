import { useEffect, useState } from "react";

export default function ToDo() {
  const [isInputExpanded, setInputExpanded] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/todo/tasks");
        const data = await response.json();
        const sortedTasks = data.sort((a, b) => a.id - b.id);
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetch("http://localhost:8000/api/todo/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: newTask }),
        });

        if (response.ok) {
          try {
            const updatedTasksResponse = await fetch(
              "http://localhost:8000/api/todo/tasks"
            );
            const updatedTasksData = await updatedTasksResponse.json();
            const sortedTasks = updatedTasksData.sort((a, b) => a.id - b.id);
            setTasks(sortedTasks);
          } catch (error) {
            console.error("Error fetching updated tasks:", error);
          }
          setNewTask("");
          setInputExpanded(false);
        } else {
          console.error("Failed to add task:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
  const handleEditTask = async (taskId, newText) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/todo/edit/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: newText }),
        }
      );
      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error("Failed to edit task:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/todo/delete/${taskId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error("Failed to edit task:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };
  return (
    <div>
      {isInputExpanded ? (
        <div className="flex">
          <input
            className="min-w-80 bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded"
            placeholder="Type here your task"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setInputExpanded(true)}
        >
          Add task
        </button>
      )}
      <ul className="min-w-80 mt-4">
        {tasks.map((task) => (
          <li
            className="flex justify-between p-2 mb-2 text-black-700 font-semibold border border-blue-500 rounded"
            key={task.id}
          >
            {task.text}
            <div>
              <span
                onClick={() => {
                  const newText = prompt("Enter new text:", task.text);
                  if (newText !== null) {
                    handleEditTask(task.id, newText);
                  }
                }}
                style={{ marginLeft: "0.5rem", cursor: "pointer" }}
              >
                ✏️
              </span>
              <span
                onClick={() => handleDeleteTask(task.id)}
                style={{ marginLeft: "0.5rem", cursor: "pointer" }}
              >
                🗑️
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
