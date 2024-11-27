import React, {useState, useEffect} from "react";

// Nos ayudará con la funcionalidad del drag and drop: https://youtu.be/XlXT9lhy-4M?si=r3-oGXFKvVXH8m3d
import {Reorder} from "framer-motion"


const Home = () => {
	// State variables for First Input and Tasks
	const [inputValue,setInputValue] = useState("")
	const [tasks, setTask] = useState([])

	// Retrieves localStorage
	useEffect(() => {
		const data = window.localStorage.getItem('my-saved-tasks')
		data !== null ? setTask(JSON.parse(data)) : ""
	}, [])

	// Saves to localStorage
	useEffect (() => {
		window.localStorage.setItem('my-saved-tasks', JSON.stringify(tasks))
	}, [tasks])

	// Adds a newTask object with {text: Input value on Enter, completed: If this tasks is checked}
	const addNewTask = (e) => {
		if (e.key ==='Enter') {
			if (e.target.value !== "") {
				let newTask = e.target.value
				setTask([...tasks, {text :newTask, completed: false}])
				setInputValue("")
				console.log(tasks)
			}
		}
	}

	// Adds the checked-style class to one task and maps over all the tasks updating it
	function checkTask(index, completed) {
		setTask((newTaskItems) => {
			return newTaskItems.map((item, i) =>
			i === index ? { ...item, completed} : item
			);
		});
	}

	// Filters through tasks eliminating one if it coincides with the index of button
	const removeTask =(index) => {
		const newTaskItems = tasks.filter((_,i) => i !== index)
		setTask(newTaskItems)
	}

	// e.target.textContent gives us the value of the inputed value on contentEditable = "true"
	// This lets us save it as a newState and generate a new map with the updated text
	function editInsideTask(e, index) {
		// Prevents line-jump on Enter key
		e.preventDefault()
		const newTextValue = e.target.textContent;
		setTask((newTaskItems) => {
			return newTaskItems.map((item, i) =>
			i === index ? { ...item, text: newTextValue } : item
			);
		});
	}


	return (
		<>
		<div className="d-flex flex-column w-100">
			<h1 className="mx-auto text-center mt-5">Todo List</h1>
			<div className="d-flex mx-auto mt-3 task-input">
				<input type="text" placeholder="Add a new task" className="w-100" spellCheck='false' onChange={(e) => setInputValue(e.target.value)}  value={inputValue} onKeyDown= {addNewTask}/> 
				<div onClick={addNewTask}><kbd className={`${inputValue ? "enter-button": "d-none"}`}>Enter</kbd></div> 
			</div>
			<ul className="mx-auto mt-3 p-0 text-start task-holder">
				{tasks.length === 0 ? (
					<li className="mt-2">No todos left</li>
				) : (
					tasks.map((task, index) => (
					<li key={index} className="mt-2 border p-2">
						<input 
							type="checkbox" 	
							className={`form-check-input align-middle m-0 me-2 fs-4`} 
							checked = {task.completed} 
							onChange={(e) => checkTask(index, e.target.checked)}
						></input>
						<label  
							className={`align-middle fs-5 px-2 me-2 py-1 ${task.completed ? "checked-style" : ""}`} 
							onKeyDown={e => e.key === "Enter" ? (editInsideTask(e, index), e.target.blur()) : null} 
							onBlur={e => editInsideTask(e, index)} 
							spellCheck='false' 
							contentEditable="true" 
							suppressContentEditableWarning="true"> {task.text}
						</label>
						
						<button className="btn btn-outline-danger me-2 align-middle d-flex justify-content-end ms-auto" onClick={() => removeTask(index)}><i className="fa-solid fa-trash"></i></button>
					</li>
				)))}
			</ul>
		</div>	
		</>
	);
};

export default Home;
