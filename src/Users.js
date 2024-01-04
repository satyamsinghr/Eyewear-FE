import React, { useState, useEffect, useRef } from "react";
import ReactTable from "./ReactTable";
import { useNavigate, useLocation } from "react-router";

import { API_URL } from "./helper/common";

const collectionValues = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const Users = () => {
  const childRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [validation, setValidation] = useState({});
  const [formData, setForm] = useState(collectionValues);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const columns = [
    {
      Header: "Id",
      accessor: "id",
      className: "px-3 py-3",
    },
    {
      Header: "First Name",
      accessor: "firstName",
      className: "px-3 py-3",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      className: "px-3 py-3",
    },
    {
      Header: "Email",
      accessor: "email",
      className: "px-3 py-3",
    },
    {
      Header: "Password",
      accessor: "password",
      // Cell: ({ row }) => (
      //   <input style={{width: "100%", fontSize: "14px", border: "1px solid #000",
      //     height: "35px",
      //     borderRadius: "4px",
      //     outline: "none",
      //     boxShadow: "none"}} type="text" />
      // ),
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
    console.log(location.pathname);
    const role = JSON.parse(localStorage.getItem("role"));
    if (role == "2") {
      navigate("/");
    }
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId) {
      setUserId(userId);
    } else {
      navigate("/");
    }
    setRole(role);
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
    }
  }, [userId]);

  const handleDelete = async (id) => {
    const data = {
      id: id,
    };
    if (!data.id) {
      return;
    }
    const response = await fetch(`${API_URL}/v1/delete-users`, {
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

  const submitEdits = async (user) => {
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password : user.password
    };
    // e.preventDefault();
    if (data.id) {
      const response = await fetch(`${API_URL}/v1/update-user`, {
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
        window.location.reload()
      } else {
        console.log("Edit failed");
      }
    }
  };

  const validateForm = (collection) => {
    const { firstName, lastName, email, password } = collection;
    let error = {};
    let isError = false;
    if (!firstName) {
      error.firstName = "Required !";
      isError = true;
    }
    if (!lastName) {
      error.lastName = "Required !";
      isError = true;
    }
    if (!email) {
      error.email = "Required !";
      isError = true;
    }
    if (!password) {
      error.password = "Required !";
      isError = true;
    }
    setValidation(error);
    return isError;
  };

  const getdata = async () => {
    const getResponse = await fetch(
      `${API_URL}/v1//users?userId=${userId}`,
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
      setUsers(data.Users);
    } else {
      console.log("Get Failed");
    }
  };

  const handleSubmit = async (e, collection) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = collection;
    if (!validateForm(collection)) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      };
      const res = await fetch(`${API_URL}/v1/create-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const values = await res.json();
        getdata(values);
        childRef.current.resetNewRowData();
      } else {
        console.log("Post Failed");
      }
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  };

  const ActionCell = ({ row, submitEdits, handleDelete }) => (
      <div>
        <button
          className="btn btn-primary me-3"
          onClick={() => submitEdits(row.original)}
        >
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
      </div>
  );

  console.log("users", users)

  return (
    <>
      <div>Users</div>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div className="user_style">
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card rounded overflow-hidden user_table">
                <ReactTable
                  tableType={"users"}
                  ref={childRef}
                  columns={columns}
                  data={users}
                  handleSubmit={handleSubmit}
                  role={role}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Users;
