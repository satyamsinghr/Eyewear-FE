import React, { useState, useEffect, useRef,memo } from "react";
import ReactTable from "./ReactTable";
import { useNavigate } from "react-router";
import moment from "moment";
import { toast } from 'react-toastify';
import { Button, Modal } from "react-bootstrap";
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';
const collectionValues = {
  id: "",
  Coll_id: "",
  Coll_name: "",
  Coll_date: "",
  Coll_desc: "",
};

const FileCollection = () => {
  const childRef = useRef();
  const navigate = useNavigate();
  // const [pageIndex, setPageIndex] = useState(0);
  // const [pageSize, setPageSize] = useState(5);
  const [collection, setCollection] = useState(collectionValues);
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);
  const [filteredColl, setFilteredCollection] = useState([]);
  const [currentcollectionId, setCurrentCollectionId] = useState("");
  const [selectedCollectionId, SetSelectedCollectionId] = useState("");
  const [currentExportCollectionId, setcurrentExportCollectionId] = useState("");
  const [todoEditing, setTodoEditing] = useState(false);
  const [editingText, seteditingText] = useState({});
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [collId, setCollId] = useState([]);
  const [csvModel, setCsvModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [resetCollectionModel, setResetCollectionModel] = useState(false);
  const [deleteCollectionID, setDeleteCollectionId] = useState("");
  const [resetCollectionID, setResetCollectionID] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [csvName, setCsvName] = useState("");
  const columns = [
    {
      Header: "Id",
      accessor: "Coll_id",
      className: "px-3 py-3",
    },
    {
      Header: "Collection Name",
      accessor: "Coll_name",
      className: "px-3 py-3",
    },
    {
      Header: "Collection Date",
      accessor: "Coll_date",
      className: "px-3 py-3",
    },
    {
      Header: "Collection Description",
      accessor: "Coll_desc",
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
          downloadCollectionLens={downloadCollectionLens}
          openCsvModel={openCsvModel}
          ResetLensStatus={ResetLensStatus}
        />
      ),
      className: "px-3 py-3",
    },
  ];

  const openCsvModel = (id) => {
    setcurrentExportCollectionId(id)
    setCsvModel(true);
  };

  const closeCsvModel = () => {
    setCsvModel(false);
    setCsvFile(null);
    setCsvName("");
    setcurrentExportCollectionId('');
  };
  const openDeleteModel = (id) => {
    setDeleteModel(true);
    setDeleteCollectionId(id)
  };

  const closeDeleteModel = () => {
    setDeleteModel(false);
    setDeleteCollectionId('')
  };
  const openResetCollectionModel = (id) => {
    setResetCollectionModel(true);
    setResetCollectionID(id)
  };

  const closeResetCollectionModel = () => {
    setResetCollectionModel(false);
    setResetCollectionID('')
  };


  const handleCsv = (e) => {
    setCsvName(e.target.value);
    setCsvFile(e.target.files[0]);
  };


  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId) {
      setUserId(userId);
    }
    else{
        navigate('/')
    }
    const role = JSON.parse(localStorage.getItem("role"));
    const collId = JSON.parse(localStorage.getItem("collId"));
    setRole(role);
    setCollId(collId)
    // getdata();
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
    }
  }, [userId]);

  const submitCsv = async () => {
    if (csvFile) {
      if (!csvFile.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please select a CSV file.');
        return;
      }
      const formData = new FormData();
      formData.append("csv", csvFile);
      try {
        const response = await fetch(
          `${API_URL}/v1/lensCsv?collid=${currentExportCollectionId}`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: JSON.parse(localStorage.getItem("token")),
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          closeCsvModel();
        }else {
          const errorData = await response.json();
          toast.error(errorData.error || "An error occurred.");
          closeCsvModel();
        }
      } catch (error) {
        console.error("Error:", error);
        // toast.error('Please select a correct Lens_Status for all records.');
        closeCsvModel();

      }
    }
  };


  const handleChange = (e) => {
    setCollection({ ...collection, [e.target.name]: e.target.value });
  };

  const validateForm = (collection = collection) => {
    const { Coll_name, Coll_date, Coll_desc, Coll_id } = collection;
    let error = {};
    let isError = false;
    if (!Coll_id) {
      error.Coll_id = "Required !";
      toast.error("Please fill Id");
      isError = true;
    } else if (!Coll_name) {
      error.Coll_name = "Required !";
      toast.error("Please fill Collection Name");
      isError = true;
    } else if (!Coll_date) {
      error.Coll_date = "Required !";
      toast.error("Please fill Collection Date");
      isError = true;
    } else if (!Coll_desc) {
      error.Coll_desc = "Required !";
      toast.error("Please fill Collection Description");
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
      };
      const res = await fetch(
        `${API_URL}/v1/collection?userId=${userId}`,
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
        getdata(values.Collection_Data._id);
        childRef.current.resetNewRowData();
      } else {
        console.log("Post Failed");
      }
      setCollection({
        id: "",
        Coll_id: "",
        Coll_name: "",
        Coll_date: "",
        Coll_desc: "",
      });
    }
  };

  // const handleFilterChange = async (e) => {
  //   setCurrentCollectionId(e.target.value);
  //   if(role == 1 ){
  //     const getResponse = await fetch(
  //       `${API_URL}/v1/collection?userId=${userId}&colId=${e.target.value}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: JSON.parse(localStorage.getItem("token")),
  //         },
  //       }
  //     );
  //     if (getResponse.ok) {
  //       const data = await getResponse.json();
  //       const collectionData = data.Collection_Data.map((x) => ({
  //         ...x,
  //         Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
  //       }));
  //       if (e.target.value === "") {
  //         setFilteredCollection([]);
  //         setCurrentCollectionId("");
  //       } else {
  //         setFilteredCollection(collectionData);
  //       }
  //       setCollectionListing(collectionData);
  //     } else {
  //       console.log("Get Failed");
  //     }
  //   }else{
  //     const getResponse = await fetch(
  //       `${API_URL}/v1/getCollectionsByIds?colId=${e.target.value}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: JSON.parse(localStorage.getItem("token")),
  //         },
  //         body: JSON.stringify({ collectionIds: collId }),
  //       }
  //     );
      
  //     if (getResponse.ok) {
  //       const data = await getResponse.json();
  //       const collectionData = data.Collection_Data.map((x) => ({
  //         ...x,
  //         Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
  //       }));
  //       setCollectionListing(collectionData);
  //     } else {
  //       console.log("Post Failed");
  //     }
  //   }
    
  // };

  const handleFilterChange = async (e) => {
    setCurrentCollectionId(e.target.value);
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      };
  
      let url = "";
      if (role == 1) {
        url = `${API_URL}/v1/collection?userId=${userId}&colId=${e.target.value}`;
      } else {
        requestOptions.method = "POST";
        url = `${API_URL}/v1/getCollectionsByIds`;
        requestOptions.body = JSON.stringify({ collectionIds: collId });
      }
  
      const getResponse = await fetch(url, requestOptions);
  
      if (getResponse.ok) {
        const data = await getResponse.json();
        const collectionData = data.Collection_Data.map((x) => ({
          ...x,
          Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
        }));
        if (e.target.value === "") {
          setFilteredCollection([]);
          setCurrentCollectionId("");
        } else {
          setFilteredCollection(collectionData);
        }
        setCollectionListing(collectionData);
      } else {
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        }
        console.log("Request failed:", getResponse.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getdata();
}, [userId, role, collId]);
  const getdata = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      };
  
      let url = "";
      if (role == 1) {
        url = `${API_URL}/v1/collection?userId=${userId}`;
      } else {
        requestOptions.method = "POST";
        url = `${API_URL}/v1/getCollectionsByIds`;
        requestOptions.body = JSON.stringify({ collectionIds: collId });
      }
  
      const getResponse = await fetch(url, requestOptions);
  
      if (getResponse.ok) {
        const data = await getResponse.json();
        const collectionData = data.Collection_Data.map((x) => ({
          ...x,
          Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
        }));
        setCollectionListing(collectionData);
      } else {
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          console.log("Get Failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleFiltedId = (selectedCollectionRow) => {
    const data = filteredColl.find((x) => x.id == selectedCollectionRow.id);
    setCurrentCollectionId(data.Coll_id);
    SetSelectedCollectionId(selectedCollectionRow.id);
    setFilteredCollection([]);

    const newData = {
      id: data.id,
      Coll_id: data.Coll_id,
      Coll_name: data.Coll_name,
      Coll_date: data.Coll_date,
      Coll_desc: data.Coll_desc,
    };
    setCollectionListing((state) => [newData]);
  };

  const handleDelete = async () => {
    const data = {
      Coll_id: deleteCollectionID,
    };
    const response = await fetch(`${API_URL}/v1/collection`, {
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
      toast.success('Collection deleted successfully');
      closeDeleteModel();
    } else {
      console.log("Deletion failed");
      toast.error('Fail to delete the Collection');
      closeDeleteModel();
    }
  };


  const downloadCollectionLens = async (id) => {
    const collNameObject = collectionListing.find(x => x.id === id);
    const collName = collNameObject ? collNameObject.Coll_name : null;
    const getResponse = await fetch(
      `${API_URL}/v1/lensesByCollectionId?collectionId=${id}`,
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
      if (data.lensesData.length > 0) {
        const csvData = data.lensesData.map(item => ({
          Lens_ID: item.lensId,
          Lens_Status: item.Lens_Status,
          Lens_Gender: item.Lens_Gender,
          RSphere: item.RSphere,
          RCylinder: item.RCylinder,
          RAxis: item.RAxis,
          RAdd: item.RAdd,
          LSphere: item.LSphere,
          LCylinder: item.LCylinder,
          LAxis: item.LAxis,
          LAdd: item.LAdd
        }));
        const headers = Object.keys(csvData[0]);
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${collName}.csv`;
        link.click();
        toast.success('File exported successfully.');
      } else {
        if (getResponse.status === 401) {
          handleSignOut(navigate);
        } else {
          toast.error('No lens data present for this collection');
        } 
      }
    }
    else {
      console.log("Get Failed");
    }

  };

  function update(x) {
    seteditingText(x);
    setTodoEditing(true);
    setCollection({
      id: x.id,
      Coll_id: x.Coll_id,
      Coll_name: x.Coll_name,
      Coll_date: x.Coll_date ? x.Coll_date.split("T")[0] : "",
      Coll_desc: x.Coll_desc,
    });
    return;
  }

  const submitEdits = async (coll) => {
    const { id } = coll;
    const collection = {
      Coll_name: coll.Coll_name,
      Coll_date: coll.Coll_date,
      Coll_desc: coll.Coll_desc,
    };
    // e.preventDefault();
    if (!validateForm(coll)) {
      const response = await fetch(
        `${API_URL}/v1/collection?id=${id}`,
        {
          method: "PUT",
          body: JSON.stringify(collection),
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.ok) {
        console.log("Edit successful");
        getdata();
        toast.success('The collection has been successfully edited.');
      } else {
        console.log("Edit failed");
        const errorData = await response.json();
        toast.error(errorData.error || "An error occurred.");
      }
      setCollection({
        Coll_id: "",
        Coll_name: "",
        Coll_date: "",
        Coll_desc: "",
      });
      setTodoEditing(false);
    }
  };

  const ActionCell = ({ row, submitEdits, handleDelete,downloadCollectionLens,ResetLensStatus,openCsvModel}) => (
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
          className="btn btn-primary bg-danger me-3"
          // onClick={() => handleDelete(row.original.id)}
          onClick={() => openDeleteModel(row.original.id)}
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
        <button
          className="btn btn-primary me-3"
          onClick={() => downloadCollectionLens(row.original.id)}
        >
      {/* <svg xmlns="http://www.w3.org/2000/svg" 
        width="25"
        height="25"
        fill="currentColor"
        class="bi bi-trash"
        viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg> */}
        Export
        </button>

        <button
          className="btn btn-primary me-3"
          onClick={() => openCsvModel(row.original.id)}
        >
     Import
        </button>


        <button
          className="btn btn-primary "
          // onClick={() => ResetLensStatus(row.original.id)}
          onClick={() => openResetCollectionModel(row.original.id)}
        >
        ResetLensStatus
        </button>
      </div>
  );

  const ResetLensStatus = async () => {
    // const response = await fetch(`${API_URL}/v1/cleardb?collId=${id}`, { 
    const response = await fetch(`${API_URL}/v1/cleardb?collId=${resetCollectionID}`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      toast.success('The Lens has been  reset successfully.');
      closeResetCollectionModel();
      getdata();

      // window.location.reload();
      console.log("Database cleared successfully");
    } else {
      console.log("Failed to clear the database");
    }
  };

  return (
    <>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div className="user_style">

          <div className="row search_input">
            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Collection Id"
                  name="collectionId"
                  value={currentcollectionId}
                  onChange={(e) => {
                    handleFilterChange(e);
                  }}
                />
                <label htmlFor="selectBoxDate">Collection Id</label>
                <span className="text-danger">
                  {validation.selectedCollectionId}
                </span>
                <div className="filter_sugestions">
                  {filteredColl &&
                    filteredColl.map((x) => {
                      return (
                        <span
                          className="d-block"
                          onClick={() => handleFiltedId(x)}
                        >
                          {x.Coll_id}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
                <ReactTable
                  ref={childRef}
                  columns={columns}
                  data={collectionListing}
                  handleSubmit={handleSubmit}
                  role={role}
                  tableType='collection'
                />
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>


      <Modal show={csvModel} onHide={closeCsvModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>Import CSV File</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-lg-4">
          <div class="import_file">
            <input
              type="file"
              className="form-control"
              name="csvFile"
              accept=".csv"
              onChange={(e) => {
                handleCsv(e);
              }}
              value={csvName}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className=" bg-light">
          <Button
            className="btn btn-primary bg-danger"
            variant="secondary"
            onClick={closeCsvModel}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary bg-success"
            variant="primary"
            onClick={submitCsv}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* For Delete modal */}
      <Modal show={deleteModel} onHide={closeDeleteModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>
          <div  style={{display:'flex'}}>
            <div><svg viewBox="0 0 24 24"   width="25"
            height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.31171 10.7615C8.23007 5.58716 9.68925 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.31034 17.856 2.52291 15.7061 4.94805 11.4063L5.31171 10.7615ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="#ee1b1b"></path> </g></svg></div>
             <span style={{marginTop:'3px'}}> Delete Collection</span>
            </div>
         
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-lg-4">
          <div class="import_file">
           
     Are you want to delete the Collection?
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






      {/* For Reset Collection  modal */}
      <Modal show={resetCollectionModel} onHide={closeResetCollectionModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>
          <div  style={{display:'flex'}}>
        
             <span style={{marginTop:'3px'}}> Reset LensStatus</span>
            </div>
         
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-lg-4">
          <div class="import_file">
     Are you want to reset the LensStatus?
          </div>
        </Modal.Body>
        <Modal.Footer className=" bg-light">
          <Button
            className="btn btn-primary bg-danger"
            variant="secondary"
            onClick={closeResetCollectionModel}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary bg-success"
            variant="primary"
            onClick={ResetLensStatus}
          >
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// export default FileCollection;
export default memo(FileCollection);