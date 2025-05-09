import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const baseButtonStyle = {
    padding: "6px 12px",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "white",
    border: "1px solid #666",
    borderRadius: "4px",
  };
  const [filter, setFilter] = useState("ALL"); 

  const handleAddTask = () => {
    const newTask = {
      title,
      description,
      priority,
      dueDate,
      completed: false
    };

    setTasks([...tasks, newTask]);

    // Clear form
    setTitle("");
    setDescription("");
    setPriority("LOW");
    setDueDate("");
  };

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        margin: "0"
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Task Scheduler</h1>

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={handleAddTask}>Add Task</button>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={() => setFilter("ALL")}
            style={{
              ...baseButtonStyle,
              backgroundColor: filter === "ALL" ? "darkslateblue" : baseButtonStyle.backgroundColor,
            }}
          >
            Show All
          </button>

          <button
            onClick={() => setFilter("COMPLETED")}
            style={{
              ...baseButtonStyle,
              backgroundColor: filter === "COMPLETED" ? "darkslateblue" : baseButtonStyle.backgroundColor,
            }}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("INCOMPLETE")}
            style={{
              ...baseButtonStyle,
              backgroundColor: filter === "INCOMPLETE" ? "darkslateblue" : baseButtonStyle.backgroundColor,
            }}
          >
            Incomplete
          </button>
        </div>





        <h2 style={{ marginTop: "30px" }}>Your Tasks</h2>

        {tasks
        .filter(task => {
          if (filter === "COMPLETED") return task.completed;
          if (filter === "INCOMPLETE") return !task.completed;
          return true;
        })
        .map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            isSelected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}

        {selectedIndex !== null && !tasks[selectedIndex]?.completed && (
          <button
            onClick={() => {
              const updated = [...tasks];
              updated[selectedIndex].completed = true;
              setTasks(updated);
            }}
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            Mark as Done
          </button>
        )}

        {selectedIndex !== null && (
          <button
            onClick={() => {
              const updated = tasks.filter((_, i) => i !== selectedIndex);
              setTasks(updated);
              setSelectedIndex(null);
            }}
            style={{
              marginTop: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Delete Selected Task
          </button>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task, isSelected, onClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => {
        setIsOpen(!isOpen);
        onClick();
      }}
      style={{
        backgroundColor: isSelected ? "#333" : "#222",
        border: isSelected ? "2px solid lime" : "none",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <h3 style={{ 
        margin: 0,
        textDecoration: task.completed ? "line-through" : "none",
        color: task.completed ? "#888" : "white"
       }}
      >
        {task.title}
      </h3>

      <div
        style={{
          overflow: "hidden",
          maxHeight: isOpen ? "300px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          marginTop: "10px",
          textAlign: "left",
        }}
      >
        <div>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Due:</strong> {task.dueDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
