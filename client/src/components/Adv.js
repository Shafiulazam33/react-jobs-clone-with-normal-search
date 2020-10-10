import React from 'react'
import { Icon } from 'semantic-ui-react'
import './Adv.css'
import { Link } from "react-router-dom";

var Adv = () => {

    return (
        <div class="advertise-wrapper">
            <div className="icon-briefcase"><Icon color='black' name="briefcase" /></div>
            <h1>Thank you for your insertion</h1>
            <p>Your insertion has been published , want to promote it?</p>
            <p><Link className="ui large primary button" to="/">Go back to Home</Link><Link className="ui large primary button" to="/Featured">Promote my insertion</Link></p>
        </div>
    )
}
export default Adv;