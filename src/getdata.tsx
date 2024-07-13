import axios from 'axios';
import { useState, useEffect } from 'react';
import './todolist.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  description: string;
  created: string; // ISO 8601 format date string
}

export interface TaskList {
  tasks: Task[];
}


export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/todolist/");
        setTasks(response.data); // Assuming the API returns the array directly
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
          <p>Created: {task.created}</p>
        </div>
      ))}
    </div>
  );
};
