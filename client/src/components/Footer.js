import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Input } from 'semantic-ui-react'
import './Footer.css'
export default function Footer() {
    return (
        <div className="footer-wrapper">
            <div className="footer">
                <div className="contact"><h4>Connect</h4>
                    <Button color='facebook'>
                        <Icon name='facebook' />Facebook
                </Button><Button color='twitter'>
                        <Icon name='twitter' />Twitter
                </Button>
                </div>
                <div className="subscribe"><h4>Hear from us</h4>
                    <Input placeholder='Email' />
                    <Button>Subscribe</Button>
                </div>
                <div className="subscribe"><h4>Subscribe</h4>
                    <ul>
                        <Link to="/faq"><li>Faq</li></Link>
                        <Link to="/privacy"><li>Privacy policy</li></Link>
                        <a href="#"><li>Contact us</li></a>
                    </ul>
                </div>
                <div className="subscribe">
                    <h4>© React {"<Jobs />"}</h4>
                    <p>Not affiliated with Facebook.</p>
                </div>
            </div>
        </div>
    )
}
