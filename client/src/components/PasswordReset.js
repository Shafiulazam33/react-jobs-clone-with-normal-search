import React from 'react'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Axios from 'axios'
import { Button, Message } from 'semantic-ui-react'
import './Signin.css'

export default function PasswordReset() {
    let query = new URLSearchParams(useLocation().search);
    let history = useHistory()
    const [state, setState] = useState({ newPassword: "", confirmPassword: "" });
    const [stateError, setError] = useState({});
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;

        setState({ ...state, [nam]: val });
    }
    const checkPassword = () => {
        let error = {};
        if (state.newPassword === "") {
            error.newPassword = "Please Enter New Password"
        }
        if (state.newPassword.length !== 0 && state.newPassword.length < 6) {
            error.newPassword = "Password Length Must 6 Character Long"
        }
        if (state.confirmPassword === "") {
            error.confirmPassword = "Please Enter New Password"
        }
        if (state.confirmPassword.length !== 0 && state.confirmPassword.length < 6) {
            error.confirmPassword = "Password Length Must 6 Character Long"
        }
        if (state.newPassword.length !== 0 && state.confirmPassword.length !== 0 && state.confirmPassword !== state.newPassword) {
            error.match = "Passwords Don't Match"
        }
        setError({ ...error })
        if (Object.keys(error).length > 0) {
            return true
        } else { return false }
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        if (checkPassword()) {
            return;
        }
        let email = query.get("email")
        Axios.put(`/api/profile/password-reset?token=${query.get("token")}`, { email, ...state })
            .then((res) => {
                history.push("/signin")
            })
            .catch(error => {
                setError(error.response.data)
            })
    }
    return (
        <div className="signin-form-wrapper">
            {stateError.confirm &&
                <Message warning>
                    <Message.Header>Confirm  Your Email</Message.Header>
                    <p>Visit Your Email, then try again.</p>
                </Message>
            }
            <h1>Resest Password For {query.get("email")}</h1>
            <div className="signin-form">

                <form onSubmit={SubmitHandler}>
                    <div className="email-input-wrapper">
                        <p class="title">New Password</p>
                        <div class="ui input"><input name="newPassword" onChange={myChangeHandler} value={state.newPassword} />
                            {stateError.newPassword && <p>{stateError.newPassword}</p>}
                        </div>
                    </div>
                    <div className="password-input-wrapper">
                        <p class="title">Confirm Password</p>
                        <div class="ui input"><input name="confirmPassword" onChange={myChangeHandler} value={state.confirmPassword} />
                            {stateError.confirmPassword && <p>{stateError.confirmPassword}</p>}
                        </div>
                    </div>
                    <Button color='teal'>Change Password</Button>
                </form>
            </div>
        </div>

    )
}


