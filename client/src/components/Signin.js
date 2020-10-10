import React from 'react'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import jwtDecode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'
import { Button, Message } from 'semantic-ui-react'
import './Signin.css'

export default function Signin() {
    const [state, setState] = useState({ email: "", password: "" });
    const [error, setError] = useState({});
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setState({ ...state, [nam]: val });
    }
    const SubmitHandler = (e) => {
        e.preventDefault();
        Axios.post('/api/profile/login', state)
            .then((res) => {
                let token = res.data.token
                localStorage.setItem('auth_token', token)
                setAuthToken(token)
                let decode = jwtDecode(token)
                if (decode.isAdmin === true) {
                    history.push('/admin')
                }
                else {
                    history.push('/')
                    window.location.reload();
                }

            })
            .catch(error => {
                console.log(error.response)
                setError(error.response.data)
            })

    }
    let history = useHistory();
    return (
        <div className="signin-form-wrapper">
            {error.message &&
                <Message warning>
                    <Message.Header>Oppps!</Message.Header>
                    <p>Invalid Email/Password</p>
                </Message>
            }
            {error.confirm &&
                <Message warning>
                    <Message.Header>Oppps!</Message.Header>
                    <p>Please Confirm Your Email</p>
                </Message>
            }
            <div className="signin-form">
                <form onSubmit={SubmitHandler}>
                    <h1>Sign In</h1>
                    <div className="email-input-wrapper">
                        <p class="title">Email</p>
                        <div class="ui input"><input name="email" onChange={myChangeHandler} value={state.email} />
                        </div>
                        {error.email && <p className="error">{error.email}</p>}
                    </div>
                    <div className="password-input-wrapper">
                        <p class="title">Password<Link to="/reset">(Forget Password?)</Link></p>
                        <div class="ui input"><input name="password" onChange={myChangeHandler} value={state.password} />
                        </div>
                        {error.password && <p className="error">{error.password}</p>}
                    </div>
                    <Button color='teal'>Sign in</Button>
                </form>
            </div>
            <div className="account-link">
                Don't Have An Account?<br></br>
                <Link to="/signup">Create account</Link>
            </div>
        </div>

    )
}


