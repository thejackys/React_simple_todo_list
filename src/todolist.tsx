import axios from 'axios'
import { useState, useEffect } from 'react'
import './todolist.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  description: string;
  created: string; // ISO 8601 format date string
}

function AddButton({onAddbuttonClick}: {onAddbuttonClick: () => void}){
  return (
    <button className='Add-Button' onClick={onAddbuttonClick}>+</button>
  )
}

function DeleteButton({onDeletebuttonClick}: {onDeletebuttonClick: () => void}){
  return (
    <button className='Delete-Button' onClick={onDeletebuttonClick}>X</button>
  )
}

function SearchBar({filterText, onfilterChange}: 
    {filterText: string, onfilterChange: (filterText: string) => void}){
  
  return (
    <>
    <input type="text"  className='SearchBar' placeholder="Search..."
        value={filterText} onChange={(e) => onfilterChange(e.target.value)}/>
    </>
    
  )
}

function Task({task, onDeletebuttonClick, onTaskCompletionChange}:
    {task: Task, onDeletebuttonClick: () => void, onTaskCompletionChange: () => void}
) {
  return (
    <div className='item'>
    <tr>
        <td><input type="checkbox"  checked={task.completed} onChange={onTaskCompletionChange} /></td>
        <td><span className='task-text'>{task.title ? task.title : ''}</span></td>
        {/* <td><span className='task-text'>{task.description ? task.description : ''}</span></td> */}
        <td style={{textAlign: 'right'}}><DeleteButton onDeletebuttonClick={onDeletebuttonClick}/></td>
    </tr>
      
    </div>
  )
}

function TaskList({taskList, onDeletebuttonClick, onTaskCompletionChange}: 
    {taskList: Task[], onDeletebuttonClick: (id :number) => void, onTaskCompletionChange: (id:number) => void}) {
  return (
    <div className='list'>
      {taskList.map(task => (
        <Task key={task.id} task={task} 
        onDeletebuttonClick={() => onDeletebuttonClick(task.id)}
        onTaskCompletionChange={() => onTaskCompletionChange(task.id)}/>
      ))}
    </div>
  )
}

function TaskGenerator({newTaskText, onNewTaskTextChange, onAddTask}: 
    {newTaskText: string, onNewTaskTextChange: (newTaskText: string) => void, onAddTask: (taskText: string) => void})
{
  return (
    <div className='Generator'>
      <input type="text" placeholder="Add a task..." className='task-text'
      value={newTaskText} onChange={(e) => {onNewTaskTextChange(e.target.value)}}/>
      <AddButton onAddbuttonClick={() => onAddTask(newTaskText)}/>
    </div>
  )
}




export function TodoList(){
    
    const [filterText, setFilterText] = useState('')
    const [newTaskText, setNewTaskText] = useState('')
    const [tasks, setTasks] = useState<Task[]>([]);
    const baseURL = "http://127.0.0.1:8000/api/todolist/";
    // const [totalTaskCount, setTotalTaskCount] = useState(0)
    // const totalTaskCount = taskList? Object.keys(taskList).length : 0
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(baseURL);
          setTasks(response.data); // Assuming the API returns the array directly
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
  
      fetchTasks();
    }, []); // Empty dependency array means this effect runs once on mount

    
    const filteredTaskList = tasks.filter((task: Task) => task.description.toLowerCase().includes(filterText.toLowerCase()))
    //filtered text only change when filterText changes

    
    function handleAddNewTask(taskText: string) {
        const newTask = {
            title: taskText,
        } as Task
        
        // add new task to tasklist
        if (newTask.description === '') return;
        const addTask = async (newTask: Task) => {
          try {
            const response = await axios.post(baseURL, newTask);
            console.log(response.data)
            const addedTask = response.data;
            const newTasks = tasks? [...tasks, addedTask] : [addedTask]
            setTasks(newTasks);
          } catch (error) {
            console.error('Error adding task:', error);
          }
        };

        addTask(newTask);
    }
    function handleDeleteTask(id: number) {
        // delete task from tasklist
        const deleteTask = async (id: number) => {
          try {
            await axios.delete(`${baseURL}${id}/`);
            const newTasks = tasks ? tasks.filter(task => task.id !== id) : [];
            setTasks(newTasks);
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        };

        deleteTask(id);
    }
    function handleTaskCompletionChange(id: number) {
        //Should I seperate complete state from taskList?
        //What would be the overhead?
        const updateTaskCompletion = async (id: number, completed: boolean) => {
          try {
            await axios.patch(`${baseURL}${id}/`, { completed });
          } catch (error) {
            console.error('Error updating task completion:', error);
          }
        };

        // update tasks
        const newTasks = tasks?.map(task => {
          if (task.id === id) {
            updateTaskCompletion(id, !task.completed);
            return {...task, completed: !task.completed}
          }
          return task
        }) 
        
        setTasks(newTasks)
    }
    
    return (
        <div>
        <SearchBar filterText={filterText} onfilterChange={setFilterText}/>
        <TaskGenerator newTaskText={newTaskText} onNewTaskTextChange={setNewTaskText} onAddTask={handleAddNewTask}/>
        <TaskList taskList={filteredTaskList} 
        onDeletebuttonClick={handleDeleteTask}
        onTaskCompletionChange={handleTaskCompletionChange}/>
        </div>
    )
}
