import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Icon } from 'semantic-ui-react'
import './Admin.css'
import { Link } from "react-router-dom";

const Admin = () => {
    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [dataLength, setDataLength] = useState(null);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [displayNone, setDisplayNone] = useState("");
    const funcFindFeaturedPost = () => {
        Axios.get('/api/job/find-featured-post')
            .then((res) => {
                setData(res.data.jobs)
                setDataLength(res.data.jobs.length)
            })
            .catch(error => {
                console.log(error)
            })
    }
    useEffect(() => {
        funcFindFeaturedPost()
    }, [])
    const funcFeaturedPostOff = (_id) => {
        window.alert("Are You Sure To Off Feature Of This Job")
        Axios.put('/api/job/featured-post-close', { _id })
            .then((res) => {
                funcFindFeaturedPost()
            })
            .catch(error => {
                console.log(error)
            })
    }
    const funcPageData = () => {
        let row = [];
        for (let i = (activePage - 1) * dataPerPage; i < (activePage * dataPerPage); i++) {
            if (Number(i) === data.length) {
                break;
            }
            row.push(<tr key={i * 25}>
                <td>
                    {data[i]._id}
                </td>
                <td>
                    {data[i].company.profile.email}
                </td>
                <td>
                    {data[i].featured.featured_created_at}
                </td>
                <td>
                    {data[i].featured.featured_expired_at}
                </td>
                <td>
                    <input className="off-button" id={data[i]._id} type="button" value="OFF" onClick={(e) => funcFeaturedPostOff(e.target.id)} />
                </td></tr>)
        }
        return row
    }
    const funcPageClick = (i) => {
        setActivePage(i)
    }
    const funcPage = () => {
        let page = (activePage - 2) <= 0 ? 1 : activePage - 2
        let range = Math.ceil(dataLength / dataPerPage)
        range = (range >= page + 4) ? (page + 4) : range
        let list = [];
        let cls;
        for (let i = page; i <= range; i++) {
            if (activePage === i) { cls = "blue"; } else { cls = "" }
            list.push(<li key={i} id={i} className={"pagination" + " " + cls} onClick={() => funcPageClick(i)}>{i}</li>)
        }
        return list
    }

    const funcRow = (e) => {
        if (e.key === "Enter") {
            setDataPerPage(Number(e.target.value));
            setActivePage(1);
        }
    }
    if (data.length > 0) {
        return (
            <div className="dashboard-wrapper">
                <div className="side-left">
                    <div className="dashboard-menu"><p>Menu</p><p><Icon name="bars" className="white" onClick={() => { (!displayNone) ? setDisplayNone("display-none") : setDisplayNone("") }} /></p></div>
                    <ul className={displayNone}>
                        <li>
                            <Link to={"/admin"}>
                                <img className="dashboard-icon" alt="" src="/images/iconfinder_pie-chart_322488.png" />
                                <span>Google Analytics</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin"}>
                                <img className="dashboard-icon" alt="" src="/images/iconfinder_table_1608863.png" />
                                <span>Featured Tables</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="side-right">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Job Id
                    </th>
                                <th>
                                    Email
                    </th>
                                <th>
                                    Featured At
                    </th>
                                <th>
                                    Featured Experider At
                    </th>
                                <th>
                                    Featured Off
                    </th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcPageData()}
                        </tbody>
                    </table>
                    <div className="pagination-wrapper">
                        <div><input type="Number" className="pagination-input" onKeyPress={
                            funcRow
                        } /> Of Rows Per Page</div>
                        <div>Go To The Page<input className="pagination-input" type="Number" onKeyPress={(e) => (e.key === "Enter") ? setActivePage(Number(e.target.value)) : ""} /></div>
                        <ul>
                            {
                                (activePage >= 2) ? <li className="pagination pag-arrow-left" onClick={() => setActivePage(activePage - 1)}>‹</li> : ""
                            }
                            {funcPage()}
                            {
                                (activePage <= Math.ceil(dataLength / dataPerPage) - 2) ? <li className="pagination pag-arrow-right" onClick={() => setActivePage(activePage + 1)}>›</li> : ""
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    } else {
        return (<> </>)
    }
}
export default Admin;
