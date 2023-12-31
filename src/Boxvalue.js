import React, { useState, useEffect, useRef } from "react";
import InlineEditingTable from "./InlineEditingTable";
import { useNavigate } from "react-router";
import ReactTable from "./ReactTable";
import moment from "moment";

import { API_URL } from "./helper/common";
const Boxvalue = () => {
  const [inputValue, setInputValue] = useState({
    id: "",
    Box_id: "",
    Box_Name: "",
    Box_date: "",
    Col_type: "",
    Coll_id: "",
  });
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [boxListing, setBoxListing] = useState([]);
  const [filteredBox, setFilteredBox] = useState([]);
  const [collection, setCollection] = useState([]);
  const [currentBoxId, setCurrentBoxId] = useState("");
  const [selectedBoxId, SetSelectedBoxId] = useState("");
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const childRef = useRef();
  const columns = [
    {
      Header: "Id",
      accessor: "Box_id",
      className: "px-3 py-3",
    },
    {
      Header: "Collection Type",
      accessor: "Col_type",
      className: "px-3 py-3",
    },
    {
      Header: "Box Name",
      accessor: "Box_Name",
      className: "px-3 py-3",
    },
    {
      Header: "Box Date",
      accessor: "Box_date",
      className: "px-3 py-3",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <ActionCell
          row={row}
          submitEdits={submitEdits} // Pass your update function here
          handleDelete={handleDelete} // Pass your handleDelete function here
        />
      ),
      className: "px-3 py-3",
    },
  ];

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId) {
      setUserId(userId);
    } else {
      navigate("/");
    }
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
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
      const collectionName = collection.find((x) => x.id == Col_type);
      const data = {
        Box_id: Box_id,
        Col_type: collectionName.Coll_name,
        Box_date: Box_date,
        Box_Name: Box_Name,
        Coll_id: Col_type,
      };

      const res = await fetch(
        `${API_URL}/v1/box?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        const values = await res.json();
        getdata();
        childRef.current.resetNewRowData();
      } else {
        console.log("Post Failed");
      }

      setInputValue({
        Box_id: "",
        Box_date: "",
        Col_type: "",
        Coll_id: "",
        Box_Name: "",
      });
    }
  };

  const getCollections = async () => {
    const collection = await fetch(
      `${API_URL}/v1/collection?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (collection.ok) {
      const data = await collection.json();
      setCollection(data.Collection_Data);
    } else {
      console.log("Get Failed");
    }
  };

  const handleFiltedId = (selectedBoxRow) => {
    const data = filteredBox.find((x) => x.id == selectedBoxRow.id);
    setCurrentBoxId(data.Box_id);
    SetSelectedBoxId(selectedBoxRow.id);
    setFilteredBox([]);

    const newData = {
      id: data.id,
      Box_id: data.Box_id,
      Box_Name: data.Box_Name,
      Col_type: data.Col_type,
      Box_date: data.Box_date ? data.Box_date.split("T")[0] : "",
    };
    setBoxListing((state) => [newData]);
  };

  const handleFilterChange = async (e) => {
    setCurrentBoxId(e.target.value);
    const getResponse = await fetch(
      `${API_URL}/v1/box?userId=${userId}&boxId=${e.target.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (getResponse.ok) {
      const data = await getResponse.json();
      const boxData = data.Boxes_Data.map((x) => ({
        ...x,
        Box_date: moment(x.Box_date).format("YYYY-MM-DD"),
      }));
      if (e.target.value === "") {
        setFilteredBox([]);
        setCurrentBoxId("");
      } else {
        setFilteredBox(boxData);
      }
      setBoxListing(boxData);
    } else {
      console.log("Get Failed");
    }
  };

  const getdata = async () => {
    const getResponse = await fetch(
      `${API_URL}/v1/box?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (getResponse.ok) {
      const data = await getResponse.json();
      const boxData = data.Boxes_Data.map((x) => ({
        ...x,
        Box_date: moment(x.Box_date).format("YYYY-MM-DD"),
      }));
      setBoxListing(boxData);
    } else {
      console.log("Get Failed");
    }
  };

  const handleDelete = async (id) => {
    const data = {
      Box_id: id,
    };
    const response = await fetch(`${API_URL}/v1/box`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });

    if (response.ok) {
      console.log("Deletion successful");
      getdata();
    } else {
      console.log("Deletion failed");
    }
  };

  function update(x) {
    setTodoEditing(true);
    setInputValue({
      id: x.id,
      Box_id: x.Box_id,
      Box_Name: x.Box_Name,
      Col_type: x.Coll_id,
      Box_date: x.Box_date ? x.Box_date.split("T")[0] : "",
    });
  }

  const submitEdits = async (inputValue) => {
    if (!validateForm(inputValue)) {
      const { Box_id, Box_Name, Box_date, Col_type, id } = inputValue;
      // const collectionName = collection.find(x => x.id == id);
      const data = {
        id: id,
        Col_type: Col_type,
        Box_date: Box_date,
        Box_Name: Box_Name,
        Box_id: Box_id,
      };

      const response = await fetch(`${API_URL}/v1/box/`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });

      if (response.ok) {
        console.log("Edit successful");
        getdata();
      } else {
        console.log("Edit failed");
      }
      setInputValue({
        id: "",
        Box_id: "",
        Box_date: "",
        Col_type: "",
        Coll_id: "",
        Box_Name: "",
      });
      setTodoEditing(false);
    }
  };

  const ActionCell = ({ row, submitEdits, handleDelete }) => (
    <div>
      <button
        className="btn btn-primary me-3"
        onClick={() => submitEdits(row.original)}
      >
        {/* <strong>Edit</strong> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          class="bi bi-check"
          viewBox="0 0 16 16"
        >
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
      </button>
      <button
        className="btn btn-primary bg-danger"
        onClick={() => handleDelete(row.original.id)}
      >
        {/* <strong>Delete</strong> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          class="bi bi-trash"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </button>
      {/* <button className="btn btn-primary bg-primary" style={{marginLeft:"10px"}} onClick={() => navigate(`/analysis/${row.original.PatientId}`)}>
          <strong>Analyse</strong>
        </button> */}
    </div>
  );

  return (
    <>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div className="user_style">
          <div className="user_name">
            <h2>Box Value</h2>
            <hr className="mt-4" />
          </div>
          {/* <div className="row">
          <div className="col-12 mb-3 mt-3">
            <label className="form_title">Box Date & Lens Type</label>
          </div>
        </div> */}
          <div className="row search_input">
            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Box Id"
                  name="boxId"
                  value={currentBoxId}
                  onChange={(e) => {
                    handleFilterChange(e);
                  }}
                />
                <label htmlFor="selectBoxDate">Box Id</label>
                <span className="text-danger">{validation.selectedBoxId}</span>
                <div className="filter_sugestions">
                  {filteredBox &&
                    filteredBox.map((x) => {
                      return (
                        <span
                          className="d-block"
                          onClick={() => handleFiltedId(x)}
                        >
                          {x.Box_id}
                        </span>
                      );
                    })}
                </div>
              </div>
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
                  data={boxListing}
                  selectOptions={collection}
                  handleSubmit={handleSubmit}
                  role={role}
                />
                {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Boxvalue;
