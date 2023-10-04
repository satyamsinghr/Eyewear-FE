import React, { useState, useEffect } from 'react'

const Boxvalue = () => {
  const [inputValue, setInputValue] = useState({
    Box_id: "",
    Box_Name: "",
    Box_date: "",
    Col_type: "",
    Coll_id: "",
  });
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);

  const [collection, setCollection] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState("");


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

  const validateForm = () => {
    const { Box_date, Col_type, Box_Name } = inputValue;
    let error = {};
    let isError = false;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Box_Name, Box_date, Col_type } = inputValue;
    if (!validateForm()) {
      const collectionName = collection.find(x => x.id == Col_type);
      const data = {
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
      setCollectionListing(data.Boxes_Data);
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
      Box_id: x.id,
      Box_Name: x.Box_Name,
      Col_type: x.Coll_id,
      Box_date: x.Box_date ? x.Box_date.split('T')[0] : '',
    });
  }

  const submitEdits = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const { Box_id, Box_Name, Box_date, Col_type } = inputValue;
      const collectionName = collection.find(x => x.id == Col_type);
      const data = {
        Col_type: collectionName.Coll_name,
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
        Box_id: "",
        Box_date: "",
        Col_type: "",
        Coll_id: "",
        Box_Name: ""
      })
      setTodoEditing(false);
    }
  }


  return (
    <>
      <div className="col p-5 ps-0" style={{ marginRight: 34 }}>
        <div className="user_name">
          <h2>Box Value</h2>
          <hr className="mt-4" />
        </div>
        <div className="row">
          <div className="col-12 mb-3 mt-3">
            <label className="form_title">Box Date & Lens Type</label>
          </div>
        </div>
        <div className="row search_input">
          <div className="col">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Box Name"
                name="Box_Name"
                onChange={handleChange}
                value={inputValue.Box_Name}
              />
              <label htmlFor="floatingInput">Box Name</label>
              <span className="text-danger">{validation.Box_Name}</span>
            </div>
          </div>
          <div className="col">
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                id="floatingInput"
                placeholder="Box Date"
                name="Box_date"
                onChange={handleChange}
                value={inputValue.Box_date}
              />
              <label htmlFor="floatingInput">Box Date</label>
              <span className="text-danger">{validation.Box_date}</span>
            </div>
          </div>
          <div className="col">
            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="floatingInput"
                placeholder="Lens Type"
                name="Col_type"
                onChange={handleChange}
                value={inputValue.Col_type}
                defaultValue=""
              >
                <option disabled selected value="">Select a Name</option>
                {
                  collection.map((val, index) => {
                    return (
                      <option value={val.id}>{val.Coll_name}</option>
                    );
                  })
                }
              </select>
              <label htmlFor="floatingInput">Collection Type</label>
              <span className="text-danger">{validation.Col_type}</span>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-floating mb-3">
              <button className="btn btn-primary w-100" onClick={todoEditing === true ? submitEdits : handleSubmit}>{todoEditing ? <span>Update</span> : <span>Submit</span>}</button>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="table_card bg-white rounded">
              <table className="table w-full m-0">
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
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Boxvalue