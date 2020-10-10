import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import Axios from 'axios'
import jwtDecode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'
import { Button, Icon } from 'semantic-ui-react'
const decodeEmail = () => {
    let token = localStorage.getItem('auth_token')
    if (token) {
        let decode = jwtDecode(token)
        return decode.email
    } else { return "" }
}
export default function Profilechanger() {
    const [passMessage, setpassMessage] = useState()
    const [emailMessage, setemailMessage] = useState()
    const [stateemail, setStateemail] = useState({ currentEmail: decodeEmail(), newEmail: "", confirmEmail: "" });
    const [statepass, setStatepass] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const onChangeEmailHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setStateemail({ ...stateemail, [nam]: val });
    }
    const onChangePasswordHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setStatepass({ ...statepass, [nam]: val });
    }
    const emailsubmitHandler = (e) => {
        e.preventDefault()
        Axios.put('/api/profile/update-email', stateemail)
            .then(res => {
                localStorage.removeItem('auth_token')
                setpassMessage(null)
                setemailMessage(<Message positive>
                    <Message.Header>You are eligible for a reward</Message.Header>
                    <p>
                        Please Confirm Your New Email, Check Your Mail
    </p>
                </Message>)

                setTimeout(
                    function () {
                        history.push('/')
                        window.location.reload();
                    },
                    7000
                );
            })
            .catch(error => {
            })
    }
    const passwordsubmitHandler = (e) => {
        e.preventDefault()
        Axios.put('/api/profile/update-password', statepass)
            .then(res => {
                let token = res.data.token
                localStorage.setItem('auth_token', token)
                setAuthToken(token)
                let decode = jwtDecode(token)
                setemailMessage(null)
                setpassMessage(<Message positive>
                    <Message.Header>You are eligible for a reward</Message.Header>
                    <p>
                        Your Password Successfully Changed
    </p>
                </Message>)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const { currentEmail, newEmail, confirmEmail } = stateemail;
    const { currentPassword, newPassword, confirmPassword } = statepass;
    let history = useHistory()
    return (
        <div className="profile-form">
            {passMessage || emailMessage}
            <form onSubmit={emailsubmitHandler}>
                <div className='email-change-form'>
                    <div className="horizontal-line">
                        <div className="logo-wrapper">
                            <Icon color='black' name="mail" /><span>Change Email</span>
                        </div>
                    </div>
                    <div className="email-change-wrapper">
                        <div className="current-email">
                            <p className="title">Current Email:</p>
                            <div className="ui input">
                                <input
                                    type="email"
                                    className='form-control'
                                    placeholder="Enter Amount"
                                    name='currentEmail'
                                    value={currentEmail}
                                    onChange={onChangeEmailHandler}
                                    disabled
                                />

                            </div>
                        </div>
                        <div className="new-email">
                            <p className="title">New Email:</p>
                            <div className="ui input">
                                <input
                                    type="email"
                                    className='form-control'
                                    placeholder=""
                                    name='newEmail'
                                    value={newEmail}
                                    onChange={onChangeEmailHandler}
                                />
                            </div>
                        </div>
                        <div className="confirm-email">
                            <p className="title">Confirm Email:</p>
                            <div className="ui input">
                                <input
                                    type="email"
                                    className='form-control'
                                    placeholder=""
                                    name='confirmEmail'
                                    value={confirmEmail}
                                    onChange={onChangeEmailHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="email-submit">
                        <Button type="submit" primary>Update Email</Button>
                    </div>
                </div>
            </form>
            <form onSubmit={passwordsubmitHandler}>
                <div className='password-change-form'>
                    <div className="horizontal-line">
                        <div className="logo-wrapper">
                            <Icon color='black' name="key" /><span>Change Password</span>
                        </div>
                    </div>
                    <div className="password-change-wrapper">
                        <div className="current-password">
                            <p className="title">Current Passwod:</p>
                            <div className="ui input">
                                <input
                                    type="password"
                                    className='form-control'
                                    placeholder="Enter Amount"
                                    name='currentPassword'
                                    value={currentPassword}
                                    onChange={onChangePasswordHandler}
                                />
                            </div>
                        </div>
                        <div className="new-password">
                            <p className="title">New Password</p>
                            <div class="ui input">
                                <input
                                    type="password"
                                    className='form-control'
                                    placeholder=""
                                    name='newPassword'
                                    value={newPassword}
                                    onChange={onChangePasswordHandler}
                                />
                            </div>
                        </div>
                        <div className="confirm-password">
                            <p className="title">Confirm Password</p>
                            <div class="ui input">
                                <input
                                    type="password"
                                    className='form-control'
                                    placeholder="Enter Amount"
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={onChangePasswordHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="password-submit">
                        <Button type="submit" primary>Update Password</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}


