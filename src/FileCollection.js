import React, { useState, useEffect, useRef } from 'react'
import ReactTable from './ReactTable';
import { useNavigate } from 'react-router';
import moment from 'moment';

const collectionValues = {
    id: "",
    Coll_id: "",
    Coll_name: "",
    Coll_date: "",
    Coll_desc: ""
}

const FileCollection = () => {
    const childRef = useRef();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(collectionValues)
    const [validation, setValidation] = useState({});
    const [collectionListing, setCollectionListing] = useState([]);
    const [filteredColl, setFilteredCollection] = useState([]);
    const [currentcollectionId, setCurrentCollectionId] = useState("");
    const [selectedCollectionId, SetSelectedCollectionId] = useState("");
    const [todoEditing, setTodoEditing] = useState(false);
    const [editingText, seteditingText] = useState({});
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState('');
    const columns = [
        {
            Header: 'Id',
            accessor: 'Coll_id',
            className: 'px-3 py-3',
        },
        {
            Header: 'Collection Name',
            accessor: 'Coll_name',
            className: 'px-3 py-3',
        },
        {
            Header: 'Collection Date',
            accessor: 'Coll_date',
            className: 'px-3 py-3',
        },
        {
            Header: 'Collection Description',
            accessor: 'Coll_desc',
            className: 'px-3 py-3',
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <ActionCell
                    row={row}
                    submitEdits={submitEdits} // Pass your update function here
                    handleDelete={handleDelete} // Pass your handleDelete function here
                />
            ),
            className: 'px-3 py-3',
        },
    ];

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('userId'))
        setUserId(userId);
        const role = JSON.parse(localStorage.getItem('role'));
        setRole(role);
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

    const validateForm = (collection) => {
        const { Coll_name, Coll_date, Coll_desc, Coll_id } = collection;
        let error = {};
        let isError = false;
        if (!Coll_id) {
            error.Coll_id = "Required !";
            isError = true;
        }
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

    const handleSubmit = async (e, collection) => {
        e.preventDefault();
        const { Coll_name, Coll_date, Coll_desc, Coll_id } = collection;
        if (!validateForm(collection)) {
            const data = {
                Coll_id: Coll_id,
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
                id: '',
                Coll_id: "",
                Coll_name: "",
                Coll_date: "",
                Coll_desc: "",
            })
        }
    }

    const handleFilterChange = async (e) => {
        if (e.target.value === '') {
            setFilteredCollection([]);
            setCurrentCollectionId('')
            return;
        }
        setCurrentCollectionId(e.target.value)
        const getResponse = await fetch(`http://localhost:8080/api/v1/collection?userId=${userId}&colId=${e.target.value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('token'))
            }

        });
        if (getResponse.ok) {
            const data = await getResponse.json();
            const collectionData = data.Collection_Data.map(x => ({
                ...x,
                Coll_date: moment(x.Coll_date).format('YYYY-MM-DD')
            }))
            setFilteredCollection(collectionData)
            setCollectionListing(collectionData);

        } else {
            console.log('Get Failed');
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
            const collectionData = data.Collection_Data.map(x => ({
                ...x,
                Coll_date: moment(x.Coll_date).format('YYYY-MM-DD')
            }))
            setCollectionListing(collectionData);

        } else {
            console.log('Get Failed');
        }

    }

    const handleFiltedId = (selectedCollectionRow) => {
        const data = filteredColl.find(x => x.id == selectedCollectionRow.id)
        setCurrentCollectionId(data.Coll_id)
        SetSelectedCollectionId(selectedCollectionRow.id)
        setFilteredCollection([]);

        const newData = {
            id: data.id,
            Coll_id: data.Coll_id,
            Coll_date: data.Coll_date,
            Coll_desc: data.Coll_desc
        }
        setCollectionListing((state) => [newData]);
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
            id: x.id,
            Coll_id: x.Coll_id,
            Coll_name: x.Coll_name,
            Coll_date: x.Coll_date ? x.Coll_date.split('T')[0] : '',
            Coll_desc: x.Coll_desc
        });
        return;
    }

    const submitEdits = async (coll) => {
        const { id } = coll
        const collection = {
            Coll_name: coll.Coll_name,
            Coll_date: coll.Coll_date,
            Coll_desc: coll.Coll_desc,
        }
        // e.preventDefault();
        if (!validateForm(coll)) {
            const response = await fetch(`http://localhost:8080/api/v1/collection?id=${id}`, {
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
                Coll_id: "",
                Coll_name: "",
                Coll_date: "",
                Coll_desc: ""
            })
            setTodoEditing(false);
        }
    };

    const ActionCell = ({ row, submitEdits, handleDelete }) => (
        <td>
            <div>
                <button className="btn btn-primary me-3" onClick={() => submitEdits(row.original)}>
                    <strong>Edit</strong>
                </button>
                <button className="btn btn-primary bg-danger" onClick={() => handleDelete(row.original.id)}>
                    <strong>Delete</strong>
                </button>
                {/* <button className="btn btn-primary bg-primary" style={{marginLeft:"10px"}} onClick={() => navigate(`/analysis/${row.original.PatientId}`)}>
              <strong>Analyse</strong>
            </button> */}
            </div>
        </td>
    );

    return (
        <>
            <div className="col p-5" style={{ marginRight: 34 }}>
                <div className='user_style'>
                    <div className="user_name">
                        <h2>Filter</h2>
                        <hr className="mt-4" />
                    </div>
                    <div className="row search_input">
                        <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Collection Id"
                                    name='collectionId'
                                    value={currentcollectionId}
                                    onChange={(e) => { handleFilterChange(e) }}
                                />
                                <label htmlFor="selectBoxDate">Collection Id</label>
                                <span className="text-danger">{validation.selectedCollectionId}</span>
                                <div className='filter_sugestions'>
                                    {
                                        filteredColl && filteredColl.map(x => {
                                            return (
                                                <span className='d-block' onClick={() => handleFiltedId(x)}>{x.Coll_id}</span>
                                            );
                                        })
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* <div className="row search_input">
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
                </div> */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="table_card rounded overflow-hidden">
                                {/* <table className="table w-full m-0">
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
                            </table> */}
                                {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
                                <ReactTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit}  role={role}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileCollection