import React, {useState, useEffect} from "react";
import errorGif from '../../img/Error 405.gif';


// Nos ayudará con la funcionalidad del drag and drop: https://youtu.be/XlXT9lhy-4M?si=r3-oGXFKvVXH8m3d
import {Reorder} from "framer-motion"


const Home = () => {
	// State variables for First Input and Tasks
	const[inputValue,setInputValue] = useState("")
	const[tasks, setTask] = useState([])
	const[newUser, setNewUser] = useState("")
	const[newPassword, setPassword] = useState("")
	const[loginUser, setloginUser] = useState("")
	const[currentUserName, setCurrentUserName] = useState(null)
	const[errorMessageLogin, setErrorMessageLogin] = useState("")
	const[errorMessageRegister, setErrorMessageRegister] = useState("")

	// async function updateInfoUser() {
		
    //     try{
    //         let response = await fetch("https://playground.4geeks.com/todo/todos/Adrian_Chapple",{
    //         method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			"label": `password ${crypto.randomUUID()}`,
	// 			"is_done": false,
	// 			"id": crypto.randomUUID()
	// 		  })
    //         })
    //     let data = await response.json()
    //     console.log(data)
    //     return		           //obligatorio poner un return aunque sea asi
    //     }catch(error){
    //         console.log(error) // si algo sale mal te aviso
    //         return
    //     }
    // }

    // useEffect(() => {
    //     updateInfoUser()
    // }, [])

	// 	async function deleteInfoUser() {
		
    //     try{
    //         let response = await fetch("https://playground.4geeks.com/todo/todos/245",{
    //         method: "PUT",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			"label": "string",
	// 			"is_done": false,
	// 			"id": 245
	// 		  })
    //         })
    //     let data = await response.json()
    //     console.log(data)
    //     return		           //obligatorio poner un return aunque sea asi
    //     }catch(error){
    //         console.log(error) // si algo sale mal te aviso
    //         return
    //     }
    // }

    // useEffect(() => {
    //     deleteInfoUser()
    // }, [])


	// Tries to eliminate all User Data and fails majestically
	async function eliminateAllUserData() {
        try{
            let response = await fetch("https://playground.4geeks.com/todo/users",{
            method: "DELETE"
            })
        let data = await response.json()
        console.log(data)
        return
        }catch(error){
            console.log(error)
            return
        }
    }

	// Creates a new username upon register
	async function createUserName() {
		try {
			let response = await fetch(`https://playground.4geeks.com/todo/users/${newUser}`, {
				method: "POST",
				headers: {
					"accept": "application/json",
				},
			});
			let data = await response.json()
			console.log(data)

			if(data.detail === "User already exists.") {
				errorMessageRegisterData(data.detail)
			} else {
				setCurrentUserName(newUser)
				errorMessageRegisterData(`Registered as ${newUser}`)
			}
			return

		}catch(error){	
			console.log(error)
			return
		}
	}

	// Sends correct messaging on registering (usually an erro)
	function errorMessageRegisterData(data) {
		setErrorMessageRegister(data)
	}

	// Access a created account 
	async function loginUserName() {
        try{
            let response = await fetch(`https://playground.4geeks.com/todo/users/${loginUser}`,{
            method: "GET"
            })
        let data = await response.json()
        console.log(data)
		if(data.detail === `User ${loginUser} doesn't exist.`) {
			errorMessageLoginData(data.detail)
		} else{
			GetInfoUser(loginUser)
			setCurrentUserName(loginUser)
			errorMessageLoginData("Logged in!")
			modalLogin.modal("hide")
		}
        return
        }catch(error){
            console.log(error)
            return
        }
	}

	// Sends correct messaging on logging in (usually an erro)
	function errorMessageLoginData(data) {
		setErrorMessageLogin(data)
	}

	// Deletes Username on click 
	async function deleteUserName() {
		try {
			let response = await fetch(`https://playground.4geeks.com/todo/users/${currentUserName}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify()
			});
			let data = await response.json()
			console.log(data)
			return
		}catch(error){	
			console.log(error)
			return
		}
	}


	// Retrieves account from localStorage if theres an account
	useEffect(() => {
		const data = window.localStorage.getItem('my-user-name');
		const parsedData = JSON.parse(data);
		if (parsedData !== "" && parsedData !== null) {
		  setCurrentUserName(parsedData);
		  GetInfoUser(parsedData);
		}
	  }, []);


	// Saves account information to localStorage, if there is an account
	useEffect (() => {
		if (currentUserName !== "" && currentUserName !== null){
			window.localStorage.setItem('my-user-name', JSON.stringify(currentUserName))
		}
	}, [currentUserName])


	// Popover Triggers (didnt know how to do them in React)
	useEffect(() => {
		const popoverTriggerInfoNoSession = document.querySelector('#info-not-logged-in');
		if (popoverTriggerInfoNoSession) {
		  new bootstrap.Popover(popoverTriggerInfoNoSession, {
			container: 'body',
		  });
		}
	}, []);


	// Popover Triggers (didnt know how to do them in React)
	useEffect(() => {
		const popoverTriggerDelete = document.querySelector('#careful-delete');
		if (popoverTriggerDelete) {
		  new bootstrap.Popover(popoverTriggerDelete, {
			container: 'body',
			placement: 'bottom',
			fallbackPlacements: []
		  });
		}
	}, [currentUserName]);


	// Checks if Enter key is pressed => Checks if theres something written in imput => Goes online mode if theres a currentUserName / Or goes offline mode
	const addNewTask = (e) => {
		if (e.key ==='Enter') {
			if (e.target.value !== "") {
				if (currentUserName){
					async function updateTasksAPI() {
						try{
							let response = await fetch(`https://playground.4geeks.com/todo/todos/${currentUserName}`,{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								"label": e.target.value,
								"is_done": false,
								"id": 0
								}
							)
							})
						console.log(response.body)
						let data = await response.json()
						console.log(data)
						setInputValue("")
						await GetInfoUser(currentUserName)
						return
						}catch(error){
							console.log(error)
							return
						}
					}
					updateTasksAPI()
				} else {
					let newTask = e.target.value
					console.log(newTask);
					setTask([...tasks, {label :newTask, is_done: false}])
					setInputValue("")
				}
			}
		} 
	}


	// Callback function to get task information from a logged in user and refresh tasks
	async function GetInfoUser(loginUser) {
		try{
			let response = await fetch(`https://playground.4geeks.com/todo/users/${loginUser}`,{
			method: "GET"
			})
		let data = await response.json()
		console.log(data)
		if(loginUser && data.detail !== `User ${loginUser} doesn't exist.` && loginUser !== ""){
			setCurrentUserName(loginUser)
			setTask(data.todos)
		}
		return
		}catch(error){
			console.log(error)
			return
		}
	}


	// Adds the checked-style class to one task and maps over all the tasks updating it, also updates in API
	function checkTask(index, is_done) {
		async function checkTaskUser(index, is_done) {
			try{
				let itemId = tasks[index].id
				let response = await fetch(`https://playground.4geeks.com/todo/todos/${itemId}`,{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"is_done": is_done,
						"id": itemId
					  })
				})

				let data = response.json()
				console.log(data)
				setTask((newTaskItems) => {
					return newTaskItems.map((item, i) =>
					i === index ? { ...item, is_done} : item
					);
					})
			}catch(error) {
				console.log(error)
			}
		}
		checkTaskUser(index, is_done)
	}


	// Filters through tasks eliminating one if it coincides with the index of button, also updates in API
	const removeTask = (index) => {
		async function deleteInfoUser() {
			try{
				let itemId = tasks[index].id
				await fetch(`https://playground.4geeks.com/todo/todos/${itemId}`,{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"label": "string",
					"is_done": false,
					"id": itemId
				  })
				})

			const newTaskItems = tasks.filter((_,i) => i !== index)
			setTask(newTaskItems)
			return
			}catch(error){
				console.log(error)
				return
			}
	}deleteInfoUser()}


	// e.target.textContent gives us the value of the inputed value on contentEditable = "true"
	// This lets us save it as a newState and generate a new map with the updated text
	// Also updates in API at the same time
	function editInsideTask(e, index) {
		// Prevents line-jump on Enter key
		e.preventDefault()
		async function updateInfoUser(e, index) {
			try{
				let itemId = tasks[index].id
				const newTextValue = e.target.textContent;
				let response = await fetch(`https://playground.4geeks.com/todo/todos/${itemId}`,{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"label": newTextValue,
					"is_done": false,
					"id": itemId
				  })
				})
			let data = await response.json()
			console.log(data)
			setTask((newTaskItems) => {
				return newTaskItems.map((item, i) =>
				i === index ? { ...item, label: newTextValue } : item
				);
			});
			return		           //obligatorio poner un return aunque sea asi
			}catch(error){
				console.log(error) // si algo sale mal te aviso
				return
			}
		}
		updateInfoUser(e,index)
	}

	return (
		<>
		<div className="d-flex flex-column w-100">
			<nav className="navbar navbar-expand-lg bg-light justify-content-between border-bottom border-body">
				<div className="mx-lg-5 mx-sm-4 mx-3 my-1 align-items-center">
					<i className="fa-solid fa-book fa-2x"></i>
           			<a className="navbar-brand p-2 fw-medium fs-3">My Todo List</a>
        		</div>
				<div className="mx-lg-5 mx-sm-4 my-1" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							{currentUserName ?
								<div>
									<div className="d-flex d-lg-block d-none">
										<p className="m-0 me-1"> Welcome </p>
										<strong>{currentUserName}</strong>
									</div>
									<div className="d-flex gap-1 justify-content-end">
										<button type="button" className="btn btn-warning d-lg-block d-none" onClick={() => {setCurrentUserName(null), window.localStorage.setItem('my-user-name', JSON.stringify("")), window.location.reload() }}><i className="fa-solid fa-right-from-bracket"></i></button>
										<button type="button" className="btn btn-success d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#modalLogin"><i className="fa-solid fa-user"></i></button>
										<button type="button" className="btn btn-danger d-lg-block d-none" onClick={() => {deleteUserName(), setCurrentUserName(null), setTask(""), window.localStorage.setItem('my-user-name', JSON.stringify("")) }} id="careful-delete" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Careful, this will delete your username" data-bs-trigger="hover"><i className="fa-solid fa-trash"></i></button>
									</div>
									<button className="btn p-4 m-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
										<i className="fa-solid fa-bars fa-2x"></i>
									</button>
									<div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
										<div className="offcanvas-header">
											<h5 className="offcanvas-title fs-1" id="offcanvasRightLabel">Welcome <strong>{currentUserName}</strong></h5>
											<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
										</div>
										<div className="offcanvas-body d-lg-none d-flex flex-column">
											<button className="dropdown-item fs-3" data-bs-toggle="modal" data-bs-target="#modalLogin">
												<div className="d-flex align-items-center bg-body-tertiary p-3 border border-bottom-1">
													<i className="fa-solid fa-user mx-2"></i>
													<p className="mb-0">Change User</p>
												</div>
											</button>
											<button className="dropdown-item fs-3" onClick={() => {deleteUserName(), setCurrentUserName(null), setTask(""), window.localStorage.setItem('my-user-name', JSON.stringify("")) }} id="careful-delete" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Careful, this will delete your username" data-bs-trigger="hover">
												<div className="d-flex align-items-center bg-body-tertiary p-3 border border-bottom-1">
													<i className="fa-solid fa-trash mx-2"></i>
													<p className="mb-0">Delete User</p>
												</div>
											</button>
											<button className="dropdown-item fs-3" data-bs-toggle="modal" data-bs-target="#modalDelete" onClick={eliminateAllUserData}>
												<div className="d-flex align-items-center bg-body-tertiary p-3 border border-bottom-1">
													<i className="fa-solid fa-skull mx-2 "></i>
													<p className="mb-0">Delete all data in the server </p>
												</div>
											</button>
											<hr className="mt-auto" />
											<button className="dropdown-item text-danger fs-3 text-center" onClick={() => {setCurrentUserName(null), window.localStorage.setItem('my-user-name', JSON.stringify("")), window.location.reload() }}>Log out</button>
										</div>
									</div>
								</div>

								:

								<div className="align-content-center me-2 mb-0 p-0 d-flex ">
									<li className="nav-item d-block">
										<button type="button" className="btn btn-success me-2 d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</button>
									</li>
									<li className="nav-item d-block">
										<button type="button" className="btn btn-primary d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#modalRegister">Register</button>
									</li>

									<button className="btn p-4 m-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
										<i className="fa-solid fa-bars fa-2x"></i>
									</button>

									<div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
										<div className="offcanvas-header">
											<h5 className="offcanvas-title fs-1" id="offcanvasRightLabel">Offline mode</h5>
											<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
										</div>
										<div className="offcanvas-body d-lg-none d-flex flex-column">
											<button className="dropdown-item fs-3" data-bs-toggle="modal" data-bs-target="#modalRegister">
												<div className="d-flex align-items-center bg-body-tertiary p-3 border border-bottom-1">
													<i className="fa-solid fa-user mx-2"></i>
													<p className="mb-0">Register</p>
												</div>
											</button>
											<button className="dropdown-item fs-3" data-bs-toggle="modal" data-bs-target="#modalDelete" onClick={eliminateAllUserData}>
												<div className="d-flex align-items-center bg-body-tertiary p-3 border border-bottom-1">
													<i className="fa-solid fa-skull mx-2 "></i>
													<p className="mb-0">Delete all data in the server </p>
												</div>
											</button>
											<hr className="mt-auto" />
											<button className="dropdown-item text-success fs-3 text-center" data-bs-toggle="modal" data-bs-target="#modalLogin">Log in</button>
										</div>
									</div>
								</div>
							}
					</ul>
				</div>
			</nav>

			<div className="modal fade" id="modalDelete" tabIndex="-1" aria-labelledby="modalDelete" aria-hidden="true">
				<div className="modal-dialog">
						<div className="modal-body">
							<img src={errorGif} alt="" />
						</div>
				</div>
			</div>

			<div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="modalLogin" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">Login</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="h-auto">
								<label htmlFor="" className="col-6">Username</label>
								<input type="text" className="col-6" placeholder="Add your username" id="user-name-login" onChange={(e) => setloginUser(e.target.value)}/>
								<label htmlFor="" className="col-6" >Password</label>
								<input type="text" className="col-6 mt-2" placeholder=">:^(" onChange={(e) => setPassword(e.target.value)}/>
								<p className={`mt-2 mb-0 text-${errorMessageLogin ==="Logged in!" ? "success" : "danger"}`}>{errorMessageLogin}</p>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" className="btn btn-success" onClick={loginUserName}>Login</button>
						</div>
					</div>
				</div>
			</div>

			<div className="modal fade" id="modalRegister" tabIndex="-1" aria-labelledby="modalRegister" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">Register</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="h-auto">
								<label htmlFor="" className="col-6">Username</label>
								<input type="text" className="col-6" placeholder="Add your username" id="user-name-register" onChange={(e) => setNewUser(e.target.value)}/>
								<label htmlFor="" className="col-6">Password</label>
								<input type="text" className="col-6 mt-2" placeholder=">:^(" onChange={(e) => setPassword(e.target.value)}/>
								<p className={`mt-2 mb-0 text-${errorMessageRegister ===`Registered as ${currentUserName}` ? "success" : "danger"}`}>{errorMessageRegister}</p>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" className="btn btn-success" onClick={createUserName}>Register</button>
						</div>
					</div>
				</div>
			</div>

			<h1 className="mx-auto text-center mt-5">Todo List</h1>
			<div className="d-flex mx-auto mt-3 task-input">
				<input type="text" placeholder="Add a new task" className="w-100" spellCheck='false' onChange={(e) => setInputValue(e.target.value)}  value={inputValue} onKeyDown= {addNewTask}/> 
				<div onClick={addNewTask}><kbd className={`${inputValue ? "enter-button": "d-none"}`}>Enter</kbd></div> 
				<i className={`fa-solid fa-circle-info d-flex align-items-center ms-1 info-not-logged-in ${currentUserName ? "d-none" : ""}`} id="info-not-logged-in" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="We recommend registering/logging in to save your tasks" data-bs-trigger="hover"></i>
			</div>
			
			<ul className="mx-auto mt-3 p-0 text-start task-holder">
				{tasks.length === 0 ? (
					<li className=" ms-3">No todos left</li>
				) : (
					tasks.map((task, index) => (
					<li key={index} className="mt-2 border p-2">
						<input 
							type="checkbox" 	
							className={`form-check-input align-middle m-0 me-2 fs-4`} 
							checked = {task.is_done} 
							onChange={(e) => checkTask(index, e.target.checked)}
						></input>
						<label  
							className={`align-middle fs-5 px-2 me-2 py-1 ${task.is_done ? "checked-style" : ""}`} 
							onKeyDown={e => e.key === "Enter" ? (editInsideTask(e, index), e.target.blur()) : null} 
							onBlur={e => editInsideTask(e, index)} 
							spellCheck='false' 
							contentEditable="true" 
							suppressContentEditableWarning="true"> {task.label}
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
