import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Axios from 'axios'
import './Postjobs.css'

export default function Postjobs() {
    const { _id } = useParams();
    const [error, setError] = useState({
        company_id: "", company_name: "", website: "", logo_url: "", short_description: ""
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [state, setState] =
        useState({
            company_id: "", company_name: "", website: "", logo_url: "", short_description: ""
        });
    useEffect(() => {
        Axios.put('/api/job/find-company-edit', { _id, ...state })
            .then((res) => {
                setIsLoaded(true);
                setState(res.data.result)
            })
            .catch(error => {
                setError(error.response.data);
            })
    }, []);
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        setState({ ...state, [nam]: val });
    }
    const submitHandler = (event) => {
        event.preventDefault();
        Axios.put('/api/profile/update-company', { _id, ...state })
            .then((res) => {
                history.push('/profile/companies')
            })
            .catch(error => {
                console.log(error.response.data)
                setError({ ...error.response.data });
            })
    }

    const handleEditorChange1 = (short_description, editor) => {
        setState({ ...state, short_description })
    }
    let history = useHistory();
    if (isLoaded) {
        return (
            <>
                <div class="profile-wrapper">
                    <div class="post-job-form">
                        <form onSubmit={submitHandler}>
                            <div class="company">
                                <div class="horizontal-line">
                                    <div class="logo-wrapper">
                                        <span class="company-logo">c</span><span>Company</span>
                                    </div>
                                </div>
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
                                        initialValue={state.short_description}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo underline Blockquote | formatselect fontselect fontsizeselect| bold italic backcolor | alignleft aligncenter alignright alignjustify |bullist numlist | removeformat | cut copy paste'
                                        }}
                                        name="short_description"
                                        onEditorChange={handleEditorChange1}
                                    />
                                    {(error.short_description) ? <p className="error">{error.short_description}</p> : ""}
                                </div>
                                <Button type="submit" primary>Submit</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
            </>
        )
    }
}
