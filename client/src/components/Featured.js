import React from 'react'
import Axios from 'axios'
import jwtDecode from 'jwt-decode'
import StripeCheckout from 'react-stripe-checkout';
import { Button, Label } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import './Featured.css'
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
console.log(process.env.REACT_APP_STRIPE_KEY)
let token = localStorage.getItem('auth_token');
let decode;
if (token) {
    decode = jwtDecode(token);
}
var Featured = () => {
    let { job_id } = useParams()
    const onToken = (token) => {
        Axios.put('/api/job/payfor-feature', { ...token, job_id })
            .then((res) => {
            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div className="featured-wrapper">
            <div className="featured">
                <h1>Promote Your Jobpost!</h1>
                <ul className="featured-ul">
                    <li>Your job offer will be featured on the <b>frontpage</b> for 30 days</li>
                    <li>Your job offer will stay on top of<b>search results</b> for 30 days</li>
                    <li>Your job offer will appear in our <b>newsletter</b></li>
                </ul>
                <StripeCheckout
                    token={onToken}
                    name="React Jobs"
                    description="Make Featured Your Post"
                    email={decode.email}
                    ComponentClass="div"
                    panelLabel="Ready To Pay"
                    amount={100 * 100}
                    currency="USD"
                    stripeKey={process.env.REACT_APP_STRIPE_KEY}
                >
                    <Button as='div' labelPosition='right'>
                        <Button color='blue'>
                            Promote
      </Button>
                        <Label as='a' basic color='blue' pointing='left'>
                            $100
      </Label>
                    </Button>
                </StripeCheckout>
            </div>
        </div>
    )
}
export default Featured;