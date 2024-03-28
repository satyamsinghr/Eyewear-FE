import React, { useState, useEffect, useRef } from "react";
import ReactTable from "./ReactTable";
import { useNavigate, useLocation } from "react-router";
import moment from "moment";
import { API_URL } from "./helper/common";
import { toast } from 'react-toastify';
import { Button, Modal } from "react-bootstrap";
const collectionValues = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  Coll_id:[]
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
  const [collectionListing, setCollectionListing] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteCollectionID, setDeleteCollectionId] = useState("");
  const columns = [
    // {
    //   Header: "Id",
    //   accessor: "id",
    //   className: "px-3 py-3",
    // },
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
      Header: "Collection Id",
      accessor: "Coll_Id",
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
      getColldata();
    }
  }, [userId]);

  const openDeleteModel = (id) => {
    setDeleteModel(true);
    setDeleteCollectionId(id)
  };

  const closeDeleteModel = () => {
    setDeleteModel(false);
    setDeleteCollectionId('')
  };

  const handleDelete = async () => {
    const data = {
      id: deleteCollectionID,
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
      toast.success('User deleted successfully');
      getdata();
      closeDeleteModel();
    } else {
      console.log("Deletion failed");
      toast.error('Deletion failed');
      closeDeleteModel();
    }
  };

  const submitEdits = async (user) => {
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password : user.password,
       Coll_id:user?.Coll_id?.map(x=>x.id),
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
        // window.location.reload()
      } else {
        console.log("Edit failed");
      }
    }
  };


  const validateForm = (collection) => {
    const { firstName, lastName, email, password ,Coll_Id} = collection;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[^\s]).{8,}$/;
    let error = {};
    let isError = false;
    if (!firstName) {
      error.firstName = "Required !";
      toast.error('FirstName is Required');
      isError = true;
    }
    else if (!lastName) {
      toast.error('LastName is Required');
      error.lastName = "Required !";
      isError = true;
    }
  
    else if (!email) {
      toast.error('Email is Required');
      error.email = "Required !";
      isError = true;
  } else if (!emailPattern.test(email)) {
      toast.error('Email format is invalid');
      error.email = "Invalid email format";
      isError = true;
  } 
    else if (!Coll_Id) {
      toast.error('Collection is Required');
      error.lastName = "Required !";
      isError = true;
    }
    else if (!password  || password.length < 8) {
      toast.error('Password must be 8 digit');
      error.password = "Required !";
      isError = true;
  } 
  // else if (!passwordPattern.test(password)) {
  //     // toast.error('Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
  //     toast.error('Please enter valid Password');
  //     error.password = "Invalid password format";
  //     isError = true;
  // }
    setValidation(error);
    return isError;
  };

  // const getdata = async () => {
  //   const getResponse = await fetch(
  //     `${API_URL}/v1/users?userId=${userId}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: JSON.parse(localStorage.getItem("token")),
  //       },
  //     }
  //   );
  //   if (getResponse.ok) {
  //     const data = await getResponse.json();
  //     setUsers(data.Users);
  //   } else {
  //     console.log("Get Failed");
  //   }
  // };
  const getdata = async () => {
    const getResponse = await fetch(
      `${API_URL}/v1/users?userId=${userId}`,
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
      // Modify collections to add label and value dynamically
      const modifiedUsers = data.Users.map(user => {
        const modifiedCollections = user.Collections.map(collection => {
          const { Coll_name, Coll_id, ...rest } = collection;
          return {
            label: `${Coll_name}`,
            value: Coll_id,
            ...rest
          };
        });
        return {
          ...user,
          Collections: modifiedCollections
        };
      });
      setUsers(modifiedUsers);
    } else {
      console.log("Get Failed");
    }
  };
  

  const getColldata = async () => {
    const getResponse = await fetch(
      `${API_URL}/v1/collection?userId=${userId}`,
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
      const collectionData = data.Collection_Data.map((x) => ({
        ...x,
        value:x.id,
        label:x.Coll_name,
        Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
      }));
      setCollectionListing(collectionData);
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
        Coll_Id:collection?.Coll_Id.map(item => item.value),
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
        toast.success('User created successfully');
        const values = await res.json();
        getdata(values);
        childRef.current.resetNewRowData();
        window.location.reload();
      } else {
        toast.error('Fail to create user');
        console.log("Post Failed");
      }
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        Coll_id:[],
      });
    }
  };

  const ActionCell = ({ row, submitEdits, handleDelete }) => (
      <div>
        <button
          className="btn btn-primary me-3"
          onClick={() => submitEdits(row.original)}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            class="bi bi-check"
            viewBox="0 0 16 16"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
          </svg> */}
          Edit
        </button>
        <button
          className="btn btn-primary bg-danger"
          onClick={() => openDeleteModel(row.original.id)}
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

  return (
    <>
      <div>Users</div>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div className="user_style">
          <div className="row mt-4">
            <div className="col-12">
            <div className="table_card rounded setting_table user_table pt-0 mt-4">
                <ReactTable
                  tableType={"users"}
                  ref={childRef}
                  columns={columns}
                  data={users}
                  submitEdits={submitEdits}
                  handleSubmit={handleSubmit}
                  role={role}
                  collectionListing={collectionListing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={deleteModel} onHide={closeDeleteModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>
          <div  style={{display:'flex'}}>
            <div><svg viewBox="0 0 24 24"   width="25"
            height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.31171 10.7615C8.23007 5.58716 9.68925 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.31034 17.856 2.52291 15.7061 4.94805 11.4063L5.31171 10.7615ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ee1b1b"></path> </g></svg></div>
             <span style={{marginTop:'3px'}}> Delete User</span>
            </div>
         
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-lg-4">
          <div class="import_file">
           
     Are you want to delete the User?
          </div>
        </Modal.Body>
        <Modal.Footer className=" bg-light">
          <Button
            className="btn btn-primary bg-danger"
            variant="secondary"
            onClick={closeDeleteModel}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary bg-success"
            variant="primary"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Users;
