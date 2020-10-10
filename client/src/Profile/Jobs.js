import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom";
import { Icon, Label, Button, Checkbox } from 'semantic-ui-react'
import Axios from 'axios'
import '../Profile/Jobs.css'
export default function Jobs(props) {
    let _id;
    let { data, com } = props;
    const [statedata, setData] = useState(false)
    useEffect(() => {
        setTimeout(
            function () {
                setData(true)
            },
            3000
        );
    }, [])

    const funcCheckbox = (val, ind) => {
        funcList(null, ind.checked)
    }
    const funcCh = (val) => {
        if (!statedata) {
            if (val) { return true }
            else {
                return false
            }
        }
    }
    const funcList = (id, check) => {
        if (id != null) {
            _id = id
        }
        else {
            if (check === true) {
                Axios.put(`/api/profile/update-job`, { _id, islisted: true })
                    .then(res => {
                        setData(true)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            else {
                Axios.put(`/api/profile/update-job`, { _id, islisted: false })
                    .then(res => {
                        setData(true)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    }
    const date_diff_indays = (date1) => {
        let dt1 = new Date(date1);
        let dt2 = new Date();
        let dt = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
        if (dt === 0) {
            return "Posted Today"
        }
        else {
            return "Posted " + dt + " days ago"
        }
    }
    let history = useHistory()
    return (
        <>
            <ul className="jobs-list">
                {
                    (data) ?
                        data.map((value, index) => {
                            let { company_name, logo_url } = com.find((val) => val._id === value.company)
                            return (
                                <>
                                    <li key={value._id} className="company-post-wrapper" onClick={(e) => { e.stopPropagation(); history.push(`/job/${value._id}`) }}>
                                        <div className="company-post">
                                            <img alt="" src={logo_url} />
                                            <div className="job-details">
                                                <div className="job-position-type">
                                                    <p>
                                                        <span className="job-position">{value.job_title}</span>
                                                        <span className="job-slary"><Icon name="money bill alternate outline"></Icon>{value.salary}</span>
                                                    </p>
                                                    <p className="job-type"><Icon name="info circle"></Icon><span>{value.job_type}</span></p>
                                                </div>
                                                <div className="company-name-location">
                                                    <p className="company-name"><Icon name="chart area" />{company_name}</p>
                                                    <p className="company-location"><Icon name="location arrow" />{value.location.location_name}<span className="remote"><Icon name="home" />Remote</span></p>
                                                </div>
                                                <p className="company-post-time"><Icon name="clock outline" />{date_diff_indays(value.createdAt)}</p>
                                                <p className="line1"></p>
                                                <ul className="ul job-tags">
                                                    {
                                                        value.tags.map((val, index) => {
                                                            return (<li key={index}><Label>{val}</Label></li>)
                                                        })
                                                    }
                                                </ul>
                                                <p className="line2"></p>
                                                <div className="listed-edit-promote">
                                                    <div className="listed" onClick={(e) => e.stopPropagation()}>

                                                        <Checkbox checked={funcCh(value.islisted)}
                                                            onClick={(e) => { e.stopPropagation(); funcList(value._id, null) }} toggle onChange={funcCheckbox} />
                                                        <p>Listed</p>
                                                    </div>
                                                    <Link onClick={(e) => e.stopPropagation()} to={{ pathname: `/job/${value._id}/edit`, data: value }}><Button primary>Edit</Button></Link>
                                                    <Link onClick={(e) => e.stopPropagation()} to={{ pathname: `/featured/${value._id}`, data: value }}><Button primary>Promote</Button></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                </>
                            )
                        }) : ""
                }
            </ul>
        </>
    )
}


