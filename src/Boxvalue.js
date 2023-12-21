import React, { useState, useEffect, useRef } from 'react'
import InlineEditingTable from './InlineEditingTable';
import { useNavigate } from 'react-router';
import ReactTable from './ReactTable';
import moment from 'moment';

const Boxvalue = () => {
  const [inputValue, setInputValue] = useState({
    id : "",
    Box_id: "",
    Box_Name: "",
    Box_date: "",
    Col_type: "",
    Coll_id: "",
  });
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);

  const [collection, setCollection] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState("");
  const childRef = useRef();
  const columns = [
    {
      Header: 'Id',
      accessor: 'Box_id',
      className: 'px-3 py-3',
    },
    {
      Header: 'Collection Type',
      accessor: 'Col_type',
      className: 'px-3 py-3',
    },
    {
      Header: 'Box Name',
      accessor: 'Box_Name',
      className: 'px-3 py-3',
    },
    {
      Header: 'Box Date',
      accessor: 'Box_date',
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
    setUserId(userId)

  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
      getCollections();
    }
  }, [userId]);


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValue((prevalue) => ({ ...prevalue, [name]: value }));
  };

  const validateForm = (inputValue = inputValue) => {
    const { Box_date, Col_type, Box_Name, Box_id } = inputValue;
    let error = {};
    let isError = false;
    if (!Box_id) {
      error.Box_Name = "Required !";
      isError = true;
    }
    if (!Box_Name) {
      error.Box_Name = "Required !";
      isError = true;
    }
    if (!Box_date) {
      error.Box_date = "Required !";
      isError = true;
    }
    if (!Col_type) {
      error.Col_type = "Required !";
      isError = true;
    }
    setValidation(error);
    return isError;
  };

  const handleSubmit = async (e, inputValue) => {
    e.preventDefault();
    const { Box_Name, Box_date, Col_type, Box_id } = inputValue;
    if (!validateForm(inputValue)) {
      const collectionName = collection.find(x => x.id == Col_type);
      const data = {
        Box_id : Box_id,
        Col_type: collectionName.Coll_name,
        Box_date: Box_date,
        Box_Name: Box_Name,
        Coll_id: Col_type
      }

      const res = await fetch(`http://localhost:8080/api/v1/box?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': JSON.parse(localStorage.getItem('token'))
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const values = await res.json();
        getdata();
      }
      else {
        console.log('Post Failed')
      }

      setInputValue({
        Box_id: "",
        Box_date: "",
        Col_type: "",
        Coll_id: "",
        Box_Name: ""
      })
    }
  };

  const getCollections = async () => {
    const collection = await fetch(`http://localhost:8080/api/v1/collection?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (collection.ok) {
      const data = await collection.json();
      setCollection(data.Collection_Data);
    } else {
      console.log('Get Failed');
    }
  }

  const getdata = async () => {
    const getResponse = await fetch(`http://localhost:8080/api/v1/box?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      const boxData = data.Boxes_Data.map(x => ({
        ...x,
        Box_date : moment(x.Box_date).format('YYYY-MM-DD')
      }))
      setCollectionListing(boxData);
    } else {
      console.log('Get Failed');
    }

  }

  const handleDelete = async (id) => {
    const data = {
      Box_id: id
    };
    const response = await fetch(`http://localhost:8080/api/v1/box`, {
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
    setTodoEditing(true);
    setInputValue({
      id : x.id,
      Box_id: x.Box_id,
      Box_Name: x.Box_Name,
      Col_type: x.Coll_id,
      Box_date: x.Box_date ? x.Box_date.split('T')[0] : '',
    });
  }

  const submitEdits = async (inputValue) => {
    if (!validateForm(inputValue)) {
      const { Box_id, Box_Name, Box_date, Col_type, id } = inputValue;
      //const collectionName = collection.find(x => x.id == Col_type);
      const data = {
        id : id,
        Col_type: Col_type,
        Box_date: Box_date,
        Box_Name: Box_Name,
        Coll_id: Col_type,
        Box_id: Box_id
      }

      const response = await fetch(`http://localhost:8080/api/v1/box/`, {
        method: 'PUT',
        body: JSON.stringify(data),
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
      setInputValue({
        id : '',
        Box_id: "",
        Box_date: "",
        Col_type: "",
        Coll_id: "",
        Box_Name: ""
      })
      setTodoEditing(false);
    }
  }

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
          <h2>Box Value</h2>
          <hr className="mt-4" />
        </div>
        <div className="row">
          <div className="col-12 mb-3 mt-3">
            <label className="form_title">Box Date & Lens Type</label>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="table_card rounded overflow-hidden">
              {/* <table className="table w-full m-0">
                <thead className="rounded">
                  <tr>
                    <th className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                      Collection Type
                    </th>
                    <th className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                      Box Name
                    </th>
                    <th className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                      Box Date
                    </th>
                    <th className="py-3 px-3 font- text-basecolor-900 text-lg font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collectionListing.map((x, id) => (
                    <>

                      <tr key={x.id} className="data">
                        <td>{x.Col_type}</td>
                        <td>{x.Box_Name}</td>
                        <td>{new Date(x.Box_date).toLocaleDateString()}</td>
                        <td className="todo-actions">
                          <button className="btn btn-primary me-3" onClick={() => update(x)}>Edit</button>
                          <button className="btn btn-primary bg-danger" onClick={() => handleDelete(x.id)}>Delete</button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table> */}
              <ReactTable 
                 ref={childRef}
                 columns={columns}
                 data={collectionListing} 
                 selectOptions ={collection}
                 handleSubmit={handleSubmit}/>
              {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
            </div>
          </div>
        </div>
      </div>
      </div>

    </>
  )
}

export default Boxvalue