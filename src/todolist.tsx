import { useState } from 'react'
import './todolist.css';

interface Task {
  id: number
  text: string
  isComplete: boolean
}

interface TaskList {
  tasks: Task[]
}
let retrievedTaskList: TaskList = {
  tasks: [
    { id: 1, text: 'Learn React', isComplete: false },
    { id: 2, text: 'Learn TypeScript', isComplete: false },
    { id: 3, text: 'Build Something Awesome', isComplete: false },
    { id: 4, text: 'Learn Vite', isComplete: false }
  ]
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

function Task({task}: {task: Task}) {
  return (
    <div className='item'>
    <tr>
        <td><input type="checkbox" checked={task.isComplete} /></td>
        <td><span className='task-text'>{task.text}</span></td>
        <td style={{textAlign: 'right'}}><DeleteButton /></td>
    </tr>
      
    </div>
  )
}

function TaskList({taskList}: {taskList: TaskList}) {
  return (
    <div className='list'>
      {taskList.tasks.map(task => (
        <Task key={task.id} task={task} />
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
    const [taskList, setTaskList] = useState(retrievedTaskList)
    const [filterText, setFilterText] = useState('')
    const [newTaskText, setNewTaskText] = useState('')

    const filteredTaskList = {
        tasks: taskList.tasks.filter(task => task.text.includes(filterText))
    } //filtered text only change when filterText changes

    function handleAddNewTask(taskText: string) {
        const newTask = {
            id: taskList.tasks.length + 1,
            text: taskText,
            isComplete: false,
        }
        const newTaskList = {
            tasks: [...taskList.tasks, newTask]
        }
        setTaskList(newTaskList)
    }
    function deleteTask(id: number) {
        const newTaskList = {
            tasks: taskList.tasks.filter(task => task.id !== id)
        }
        setTaskList(newTaskList)
    }
    
    // function deleteTask(id: number) {
    //     let newTaskList = taskList.tasks.filter(task => task.id !== id) //It does not mutate the array, it creates a new array
    //     setTaskList({tasks: newTaskList})    
    //     }
    
    // function getfilteredTaskList(taskList: TaskList) {
    //     const filteredTaskList = {
    //         tasks: taskList.tasks.filter(task => task.text.includes(filterText))
    //     }
    //     return filteredTaskList
    // }

    return (
        <div>
        <SearchBar filterText={filterText} onfilterChange={setFilterText}/>
        <TaskGenerator newTaskText={newTaskText} onNewTaskTextChange={setNewTaskText} onAddTask={handleAddNewTask}/>
        <TaskList taskList={filteredTaskList} />
        </div>
    )
}
