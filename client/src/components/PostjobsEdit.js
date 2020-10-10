import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { Dropdown, Icon } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import Geosuggest from 'react-geosuggest';
import { Link } from "react-router-dom";
import Axios from 'axios'
import './Postjobs.css'
import { remoteOptions, tagOptions, experienceOptions, jobtypeOptions } from '../utils/dropdownOptions'

export default function Postjobs() {
    let change, takeSuggest;
    const geosuggestEl = useRef(null);
    const { _id } = useParams();
    const [error, setError] = useState({
        company: "", company_name: "", website: "", logo_url: "", short_description: "",
        job_title: "", location: "", remote: "", job_type: "", salary: "", experience: "",
        apply_link: "", tags: "", description: ""
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPosted, setIsPosted] = useState(false);
    const [state, setState] =
        useState({
            existing_name: [], company: "", company_name: "", website: "", logo_url: "", short_description: "",
            job_title: "", location: {}, remote: "", job_type: "", salary: "", experience: "",
            apply_link: "", tags: "", description: "", discard: false
        });
    useEffect(() => {
        Axios.put('/api/job/find-job-edit', { _id })
            .then((res) => {
                let options = []
                res.data.companies.forEach((item, index) => {
                    options.push({ key: item._id, text: item.company_name, value: item._id })
                })
                let { company_name } = res.data.companies.find((item) => {
                    return (item._id === res.data.jobposts.company)
                })
                setState({ ...state, existing_name: options, ...res.data.jobposts, company_name });
                setIsLoaded(true);
            })
            .catch(error => {
            })
    }, []);
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setState({ ...state, [nam]: val });
    }

    const dropdownChangeHandler = (event, data) => {
        setState({ ...state, [data.name]: data.value });
    }
    const onSuggestSelect = (suggest) => {
        takeSuggest = 1;
        let location = {};
        let address = suggest.gmaps.address_components
        location.location_name = suggest.gmaps.description
        location.place_id = suggest.gmaps.place_id
        address.map((value, index) => {
            if (value.types[0] === "country") {
                location.country = value.long_name;
            }
            else if (value.types[0] === "administrative_area_level_1") {
                location.admin_area1 = value.long_name;
            }
            else if (value.types[0] === "administrative_area_level_2") {
                location.admin_area2 = value.long_name;
            }
            return 0;
        }
        )
        setState({ ...state, location })
    };
    const locationHandler = (e) => {
        setState({ ...state, location: e.target.value })
        console.log(e.target.value)
    }
    const onChange = (val) => {
        change = 1;
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if (change !== takeSuggest) {
            setError({ ...error, location: "Please Provide Location From Suggested Location" })
        }
        Axios.put('/api/profile/update-job', { _id, ...state })
            .then((res) => {
                setIsPosted(true)
            })
            .catch(error => {
                setError({ ...error.response.data });
            })
    }

    const handleEditorChange1 = (short_description, editor) => {
        setState({ ...state, short_description })
    }
    const handleEditorChange2 = (description, editor) => {
        setState({ ...state, description })
    }
    const form_nameexist = (<><div class="company-wrapper">
        <div class="company-type"> <p class="title">Select an existing company</p>
            <Dropdown
                placeholder='Select Friend'
                name="company_id"
                fluid
                selection
                onChange={dropdownChangeHandler}
                options={state.existing_name}
                text={state.company_name}
            />
            {(error.company_id) ? <p className="error">Please Select A Company Name</p> : ""}
        </div>
        <h4>OR</h4>
        <Button onClick={() => setState({ ...state, discard: true, company_id: "" })} primary>create a new company</Button>
    </div></>);
    const formnotexist = (<>
        <div className="create-company-wrapper">
            <div className="company-name"><p className="title">Company name</p><div className="ui input"> <input name="company_name" onChange={myChangeHandler} value={state.company_name} placeholder="Company name" /></div>
                {(error.company_name) ? <p className="error">{error.company_name}</p> : ""}</div>
            <div className="website"><p className="title">website</p><div className="ui input">< input name="website" onChange={myChangeHandler} value={state.website} placeholder="http://www.google.com" /> </div>
                {(error.website) ? <p className="error">{error.company_name}</p> : ""}</div>
            <div className="company-logo-url"><p className="title">Company logo url</p>
                <div className="ui input">< input name="logo_url" onChange={myChangeHandler} value={state.logo_url} placeholder="http://www.google.com/logo.png" /></div>
                {(error.logo_url) ? <p className="error">{error.logo_url}</p> : ""}</div>
        </div>

        <div class="short-description">
            <p class="title">Short description</p>
            <Editor
                initialValue=""
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo underline Blockquote | formatselect fontselect fontsizeselect| bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | cut copy paste'
                }}
                name="short_description"
                onEditorChange={handleEditorChange1}
            />
            {(error.short_description) ? <p className="error">{error.short_description}</p> : ""}
        </div>
        {(state.existing_name) ? <Button onClick={() => setState({ ...state, discard: false, company_name: "" })}><Icon name="remove circle" />Discard and Select an Company name</Button> : ""}
    </>);

    if (isLoaded && !isPosted) {
        return (
            <>
                <div className="profile-wrapper">
                    <div className="post-job-form">
                        <form onSubmit={submitHandler}>
                            <div className="company">
                                <div className="horizontal-line">
                                    <div className="logo-wrapper">
                                        <span className="company-logo">c</span><span>Company</span>
                                    </div>
                                </div>
                                {(state.existing_name && state.discard === false) ? form_nameexist : formnotexist}
                            </div>
                            <div className="job">
                                <div className="horizontal-line">
                                    <div className="logo-wrapper"> <span className="job-logo"><img alt="company logo" src="/images/iconfinder_Sed-05_2232591.png" />a</span>
                                        <span>Job</span>
                                    </div>
                                </div>
                                <div className="layer1">
                                    <div className="job-title"><p className="title">Job Title</p><div className="ui input"><input type="text" name="job_title" placeholder="Front end developer" onChange={myChangeHandler} value={state.job_title} /></div>
                                        {(error.job_title) ? <p className="error">{error.job_title}</p> : ""}</div>
                                    <div className="location"> <p className="title">Location</p> <div className="ui input">
                                        <input placeholder="Pick a location e.g. Tokyo" onChange={locationHandler} value={state.location} />
                                    </div>
                                        {(error.location) ? <p className="error">{error.location}</p> : ""}</div>
                                    <div className="remote-type"><p className="title">Remote-working</p>

                                        <Dropdown
                                            placeholder='Remote Job Or Not'
                                            name="remote"
                                            onChange={dropdownChangeHandler}
                                            fluid
                                            selection
                                            options={remoteOptions}
                                            text={state.remote}
                                        />
                                        {(error.remote) ? <p className="error">{error.remote}</p> : ""}
                                    </div>
                                    <div class="job-type">
                                        <p class="title">Job Type</p>

                                        <Dropdown
                                            placeholder='job type'
                                            name="job_type"
                                            onChange={dropdownChangeHandler}
                                            fluid
                                            selection
                                            options={jobtypeOptions}
                                            text={state.job_type}
                                        />
                                        {(error.job_type) ? <p className="error">{error.job_type}</p> : ""}
                                    </div>
                                </div>
                                <div class="layer2">
                                    <div class="salary"> <p class="title">Salary</p><div class="ui input"><input name="salary" placeholder="25000$-35000$" onChange={myChangeHandler} value={state.salary} /></div>
                                        {(error.salary) ? <p className="error">{error.salary}</p> : ""}</div>
                                    <div class="experience">
                                        <div class="experience-type">
                                            <p class="title">Level of experience</p>

                                            <Dropdown
                                                placeholder='Level of experience'
                                                name="experience"
                                                onChange={dropdownChangeHandler}
                                                fluid
                                                selection
                                                options={experienceOptions}
                                                text={state.experience}
                                            />
                                            {(error.experience) ? <p className="error">{error.experience}</p> : ""}
                                        </div>
                                    </div>
                                    <div class="apply">
                                        <p class="title">Apply url or email</p><div class="ui input"><input name="apply_link" onChange={myChangeHandler} value={state.apply_link} placeholder="Url or email to use in order to apply" /></div>
                                        {(error.apply_link) ? <p className="error">{error.apply_link}</p> : ""}</div>
                                </div>
                                <div class="tags"><p class="title">Tags</p>
                                    <Dropdown
                                        placeholder='Select tags'
                                        fluid
                                        multiple
                                        search
                                        selection
                                        name="tags"
                                        onChange={dropdownChangeHandler}
                                        options={tagOptions}
                                        value={state.tags}
                                    />
                                    {(error.tags) ? <p className="error">{error.tags}</p> : ""}
                                </div>
                                <div class="description"><p class="title">Description</p>
                                    <Editor
                                        initialValue={state.description}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo underline Blockquote | formatselect fontselect fontsizeselect| bold italic backcolor |  alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | cut copy paste'
                                        }}
                                        onEditorChange={handleEditorChange2}
                                    />
                                    {(error.description) ? <p className="error">{error.description}</p> : ""}
                                </div>
                                <Button type="submit" primary>Submit</Button>
                            </div>
                        </form >
                    </div>
                </div>
            </>
        )
    } else if (isLoaded && isPosted) {
        return (
            <div class="advertise-wrapper">
                <div className="icon-briefcase"><Icon color='black' name="briefcase" /></div>
                <h1>Thank you for your insertion</h1>
                <p>Your insertion has been published , want to promote it?</p>
                <p><Link className="ui large primary button" to="/">Go back to Home</Link><Link className="ui large primary button" to={`/Featured/${_id}`}>Promote my insertion</Link></p>
            </div >
        )
    }
    else {
        return (
            <>
            </>
        )
    }
}
