import React, { useState, useEffect } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { useParams } from "react-router-dom";
import Axios from 'axios'
import './Jobdescription.css'
export default function Jobdescription() {
    const [state, setState] =
        useState({
            company_name: "", website: "", logo_url: "", short_description: "",
            job_title: "", location: "", remote: "", job_type: "", salary: "", experience: "",
            apply_link: "", tags: [], description: ""
        });
    const [isLoaded, setIsLoaded] = useState(false);

    let { _id } = useParams();
    useEffect(() => {
        Axios.post('/api/job/jobs', { _id })
            .then((res) => {
                let jobs = res.data.jobs[0]
                setState({ ...jobs, ...jobs.company })
                setIsLoaded(true);
            })
            .catch(error => {
                console.log(error)
            })
    }, []);
    function createMarkup() {
        return { __html: state.description };
    }
    function funcLink() {
        let link = 'https://' + state.website
        return link;
    }
    if (isLoaded) {
        return (
            <div className="job-description">
                <div className="job-description-layer1">
                    <h1>{state.job_title} position at {state.company_name}</h1>
                    <p className="type-salary"><Icon name="info circle"></Icon><span>{state.job_type}</span><span className="job-slary"><Icon name="money bill alternate outline"></Icon> {state.salary}</span></p>
                    <p className="location-remote"><Icon name="location arrow" />{state.location.location_name}<span className="remote">{(state.remote) ? <><Icon name="home" /><span>remote</span></> : ""}</span></p>
                    <p className="post-time"><Icon name="clock outline" />posted a month ago</p>
                    <ul className="ul job-description-tags">
                        {state.tags.map((val) =>
                            <li key={val}><Label>{val}</Label></li>
                        )}
                    </ul>
                </div>
                <div className="job-description-layer2">
                    <div className="long-description" dangerouslySetInnerHTML={createMarkup()} />
                </div>
                <div className="job-description-layer3">
                    <div className="logo-website">
                        <div className="job-description-image"><img alt="" src={state.logo_url} /></div>
                        <div><p><a href={funcLink()}><Icon name="chart area"></Icon>{state.company_name}</a></p>
                            <div dangerouslySetInnerHTML={{ __html: state.short_description }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <></>
        )
    }
}
