import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import { Checkbox, Message } from 'semantic-ui-react'
import './Signup.css'
export default function Signup() {
    const [state, setState] = useState({ email: "", password: "", confirmPassword: "", checked: false });
    const [error, setError] = useState({});
    const inputEl = useRef(null);
    useEffect(
        () => {
            if (state.checked) {
                inputEl.current.disabled = false
                inputEl.current.style.opacity = 1
            } else {
                inputEl.current.disabled = true
                inputEl.current.style.opacity = 0.7
            }
        },
        [state.checked],
    );
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setState({ ...state, [nam]: val });
    }
    const SubmitHandler = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:4000/api/profile/register', state)
            .then((res) => {
                history.push('/signin')
            })
            .catch(error => {
                setError(error.response.data);
            })
    }
    const checkboxHandler = () => {
        if (state.checked) {
            setState({ ...state, checked: false });
        } else {
            setState({ ...state, checked: true });
        }
    }
    let history = useHistory();
    return (
        <div className="signin-form-wrapper">
            {error.message &&
                <Message warning>
                    <Message.Header>Oppps!</Message.Header>
                    <p>{error.message}</p>
                </Message>
            }
            <div className="signin-form">
                <form onSubmit={SubmitHandler}>
                    <h1>Create Account</h1>
                    <div className="email-input-wrapper">
                        <p class="title">Email</p>
                        <div class="ui input"><input name="email" onChange={myChangeHandler} value={state.email} />
                        </div>
                        {error.email && <p className="error">{error.email}</p>}
                    </div>
                    <div className="password-input-wrapper">
                        <p class="title">Password</p>
                        <div class="ui input"><input name="password" onChange={myChangeHandler} value={state.password} />
                        </div>
                        {error.password && <p className="error">{error.password}</p>}
                    </div>
                    <div className="password-input-wrapper">
                        <p class="title">Confirm Password</p>
                        <div class="ui input"><input name="confirmPassword" onChange={myChangeHandler} value={state.confirmPassword} />
                        </div>
                        {error.confirmPassword && <p className="error">{error.confirmPassword}</p>}
                    </div>
                    <Checkbox label='Agree To' onClick={checkboxHandler} />
                    <Link to="/privacy-policy">Privacy-Policy</Link>
                    <br></br>
                    <input type="submit" class="submit-button" ref={inputEl} value="Sign Up" />
                </form>
            </div>

            <div className="account-link">
                Already Have An Account?<br></br>
                <Link to="/signin"><p>Sign In</p></Link>
            </div>
        </div>


    )
}


