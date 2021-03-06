/* eslint-disable react/no-multi-comp */
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const hrefStyle = {
	color: "white", 
	textDecoration: "none"
}

const bodyDivStyle = {
	margin: "auto",
	marginTop: "100px",
	width: "500px",
}

const surfaceColor = "#27292D"
const inputColor = "#383B40"

const boxStyle = {
	paddingLeft: "30px",
	paddingRight: "30px",
	paddingBottom: "30px",
	paddingTop: "30px",
	backgroundColor: surfaceColor,
}

const useStyles = makeStyles({
	notchedOutline: {
		borderColor: "#f85a3e !important"
	},
});

const LoginDialog = props => {
  const { globalUrl, isLoaded, isLoggedIn, setIsLoggedIn, setCookie, register } = props;
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [firstRequest, setFirstRequest] = useState(true);

  	// Used to swap from login to register. True = login, false = register

	const classes = useStyles();
	// Error messages etc
	const [loginInfo, setLoginInfo] = useState("");

	const handleValidateForm = () => {
		return (username.length > 1 && password.length > 8);
	}

	if (isLoggedIn === true) {
		window.location.pathname = "/workflows"		
	}


	const checkAdmin = () => {
		const url = globalUrl+'/api/v1/checkusers';
		fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
		})
		.then(response =>
			response.json().then(responseJson => {
				if (responseJson["success"] === false) {
					setLoginInfo(responseJson["reason"])
				} else {
					if (responseJson.reason === "stay") {
						window.location.pathname = "/adminsetup"		
					}
				}
			}),
		)
		.catch(error => {
			setLoginInfo("Error in userdata: ", error)
		})
	}

	if (firstRequest) {
		setFirstRequest(false)
		checkAdmin()
	}

	const onSubmit = (e) => {
		e.preventDefault()
		// FIXME - add some check here ROFL

		// Just use this one?
		var data = {"username": username, "password": password}
		var baseurl = globalUrl
		if (register) {
			var url = baseurl+'/api/v1/login';
			fetch(url, {
				mode: 'cors',
					method: 'POST',
					body: JSON.stringify(data),
					credentials: 'include',
					crossDomain: true,
					withCredentials: true,
					headers: {
        		'Content-Type': 'application/json; charset=utf-8',
					},
			})
			.then(response =>
				response.json().then(responseJson => {
					if (responseJson["success"] === false) {
						setLoginInfo(responseJson["reason"])
					} else {
						setLoginInfo("Successful login, rerouting")
						for (var key in responseJson["cookies"]) {
							setCookie(responseJson["cookies"][key].key, responseJson["cookies"][key].value, {path: "/"})
						}

						setIsLoggedIn(true)
						window.location.pathname = "/workflows"		
					}
				}),
			)
			.catch(error => {
				setLoginInfo("Error in userdata: " + error)
			});
		} else {
			url = baseurl+'/api/v1/register';
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(response =>
				response.json().then(responseJson => {
					if (responseJson["success"] === false) {
						setLoginInfo(responseJson["reason"])
					} else {
						setLoginInfo("Successful register :)")
					}
				}),
			)
			.catch(error => {
				setLoginInfo("Error in userdata: ", error)
			});
		}
	}

	const onChangeUser = (e) => {
		setUsername(e.target.value)	
	}

	const onChangePass = (e) => {
		setPassword(e.target.value)	
	}

	//const onClickRegister = () => {
	//	if (props.location.pathname === "/login") {
	//		window.location.pathname = "/register"	
	//	} else {
	//		window.location.pathname = "/login"	
	//	}

	//	setLoginCheck(!register)
	//}

	//var loginChange = register ? (<div><p onClick={setLoginCheck(false)}>Want to register? Click here.</p></div>) : (<div><p onClick={setLoginCheck(true)}>Go back to login? Click here.</p></div>);
	var formtitle = register ? <div>Login</div> : <div>Register</div>

		//	<DialogTitle>{formtitle}</DialogTitle>
		
	const basedata = 
		<div style={bodyDivStyle}>
			<Paper style={boxStyle}>
      			<form onSubmit={onSubmit} style={{margin: "15px 15px 15px 15px"}}>
					<h2>{formtitle}</h2>
					Username
					<div>
						<TextField
							color="primary"
							style={{backgroundColor: inputColor}}
							autoFocus
							InputProps={{
								classes: {
									notchedOutline: classes.notchedOutline,
								},
								style:{
									height: "50px", 
									color: "white",
									fontSize: "1em",
								},
							}}
							required
							fullWidth={true}
							autoComplete="username"
							placeholder="username@example.com"
							id="emailfield"
							margin="normal"
							variant="outlined"
      	 					onChange={onChangeUser}
						/>
					</div>
					Password	
					<div>
						<TextField
							color="primary"
							style={{backgroundColor: inputColor,}}
							InputProps={{
								classes: {
									notchedOutline: classes.notchedOutline,
								},
								style:{
									height: "50px", 
									color: "white",
									fontSize: "1em",
								},
							}}
							required
							id="outlined-password-input"
							fullWidth={true}
							type="password"
							autoComplete="current-password"
							placeholder="**********"
							margin="normal"
							variant="outlined"
      	 					onChange={onChangePass}
						/>
					</div>
					<div style={{display: "flex", marginTop: "15px"}}>
						<Button color="primary" variant="contained" type="submit" style={{flex: "1", marginRight: "5px"}} disabled={!handleValidateForm()}>SUBMIT</Button> 				
						
					</div>
					<div style={{marginTop: "10px"}}>
						{loginInfo}
					</div>
				</form>
			</Paper>
		</div>

	const loadedCheck = isLoaded ? 
		<div>
      		{basedata}
		</div>
		:
		<div>
		</div>

	return (
		<div>
			{loadedCheck}
		</div>
	)
}

export default LoginDialog;
