import React, { useState, useEffect } from 'react'

const collectionValues = {
    Coll_id: "",
    Coll_name: "",
    Coll_date: "",
    Coll_desc: ""
}

const FileCollection = () => {

    const [collection, setCollection] = useState(collectionValues)
    const [validation, setValidation] = useState({});
    const [collectionListing, setCollectionListing] = useState([]);
    const [todoEditing, setTodoEditing] = useState(false);
    const [editingText, seteditingText] = useState({});
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('userId'))
        setUserId(userId)
        // getdata();
    }, []);

    useEffect(() => {
        if (userId) {
            getdata();
        }
    }, [userId]);

    const handleChange = (e) => {
        setCollection({ ...collection, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        const { Coll_name, Coll_date, Coll_desc } = collection;
        let error = {};
        let isError = false;
        if (!Coll_name) {
            error.Coll_name = "Required !";
            isError = true;
        }
        if (!Coll_date) {
            error.Coll_date = "Required !";
            isError = true;
        }
        if (!Coll_desc) {
            error.Coll_desc = "Required !";
            isError = true;
        }
        setValidation(error);
        return isError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { Coll_name, Coll_date, Coll_desc, coll_id } = collection;
        if (!validateForm()) {
            const data = {
                Coll_name: Coll_name,
                Coll_date: Coll_date,
                Coll_desc: Coll_desc,
            }
            const res = await fetch(`http://localhost:8080/api/v1/collection?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': JSON.parse(localStorage.getItem('token'))
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const values = await res.json();
                getdata(values.Collection_Data._id);
            }
            else {
                console.log('Post Failed')
            }
            setCollection({
                Coll_id: "",
                Coll_name: "",
                Coll_date: "",
                Coll_desc: "",
            })
        }
    }

    const getdata = async () => {
        const getResponse = await fetch(`http://localhost:8080/api/v1/collection?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('token'))
            }

        });
        if (getResponse.ok) {
            const data = await getResponse.json();
            setCollectionListing(data.Collection_Data);

        } else {
            console.log('Get Failed');
        }

    }

    const handleDelete = async (id) => {
        const data = {
            Coll_id: id
        };
        const response = await fetch(`http://localhost:8080/api/v1/collection`, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('token'))
            }

        });

        if (response.ok) {
            console.log('Deletion successful');
            getdata();
        } else {
            console.log('Deletion failed');
        }
    }

    function update(x) {
        seteditingText(x);
        setTodoEditing(true);
        setCollection({
            Coll_id: x.id,
            Coll_name: x.Coll_name,
            Coll_date: x.Coll_date ? x.Coll_date.split('T')[0] : '',
            Coll_desc: x.Coll_desc
        });
        return;
    }

    const submitEdits = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const response = await fetch(`http://localhost:8080/api/v1/collection`, {
                method: 'PUT',
                body: JSON.stringify(collection),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': JSON.parse(localStorage.getItem('token'))
                },
            });

            if (response.ok) {
                console.log('Edit successful');
                getdata();
            } else {
                console.log('Edit failed');
            }
            setCollection({
                Coll_name: "",
                Coll_date: "",
                Coll_desc: ""
            })
            setTodoEditing(false);
        }
    };

    return (
        <>
            <div className="col p-5 ps-0">
                <div className="user_name">
                    <h2>Collection</h2>
                    <hr className="mt-4" />
                </div>
                <div className="row">
                    <div className="col-12 mb-3 mt-3">
                        <label className="form_title">Add a Collection</label>
                    </div>
                </div>
                <div className="row search_input">
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput"
                                placeholder="Collection Name" name='Coll_name' value={collection.Coll_name} onChange={handleChange} />
                            <label htmlFor="floatingInput">Collection Name</label>
                            <span className="text-danger">{validation.Coll_name}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="date" className="form-control" id="floatingInput"
                                placeholder="Collection Date" name='Coll_date' value={collection.Coll_date} onChange={handleChange} />
                            <label htmlFor="floatingInput">Collection Date</label>
                            <span className="text-danger">{validation.Coll_date}</span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <textarea className="form-control" placeholder="Leave a comment here"
                                id="floatingTextarea" name='Coll_desc' value={collection.Coll_desc} onChange={handleChange}></textarea>
                            <label htmlFor="floatingTextarea">Collection Description</label>
                            <span className="text-danger">{validation.Coll_desc}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <button className="btn btn-primary w-100" onClick={todoEditing === true ? submitEdits : handleSubmit} >{todoEditing ? <span>Update</span> : <span>Submit</span>}</button>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="table_card bg-white rounded">
                            <table className="table w-full m-0">
                                <thead className="rounded">
                                    <tr>
                                        <td
                                            className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                                            Collection Name
                                        </td>
                                        <td
                                            className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                                            Collection Date</td>
                                        <td
                                            className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                                            Collection Description</td>
                                        <td
                                            className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                                            Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collectionListing.map((x, id) => (
                                        <>
                                            <tr key={x.id} className="data">
                                                <td>{x.Coll_name}</td>
                                                <td>{new Date(x.Coll_date).toLocaleDateString()}</td>
                                                <td>{x.Coll_desc}</td>
                                                <td className="todo-actions">
                                                    <button className="btn btn-primary me-3" onClick={() => update(x)}><strong>Edit</strong></button>
                                                    <button className="btn btn-primary bg-danger" onClick={() => handleDelete(x.id)}><strong>Delete</strong></button>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileCollection