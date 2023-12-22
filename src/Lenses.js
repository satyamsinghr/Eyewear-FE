import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import InlineEditingTable from "./InlineEditingTable";
import { useNavigate } from "react-router";
import moment from "moment";
import ReactTable from "./ReactTable";

const Lenses = () => {
  const [formData, setFormData] = useState({
    id: "",
    lensId: "",
    Box_id: "",
    Box_Name: "",
    Lens_Status: "",
    Lens_Gender: "",
    Lens_Type: "",
    RSphere: "",
    RCylinder: "",
    RAxis: "",
    RAdd: "",
    LSphere: "",
    LCylinder: "",
    LAxis: "",
    LAdd: "",
    Lens_DTS: "",
    Is_Blocked: false,
    Is_Booked: false,
    Patient_id: "",
    LLBIF: "",
    LRBIF: "",
  });
  // const [pidvalid, setPidvalid] = useState({});
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [modelvalid, setModelvalid] = useState({});
  const [filteredLens, setFilteredLens] = useState([]);
  const [currentLensId, setCurrentLensId] = useState("");
  const [collectionListing, setCollectionListing] = useState([]);
  const [selectedLensId, SetSelectedLensId] = useState("");
  const [todoEditing, setTodoEditing] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const childRef = useRef();
  const columns = [
    {
      Header: "Id",
      accessor: "lensId",
      className: "px-3 py-3",
    },
    {
      Header: "Lens Status",
      accessor: "Lens_Status",
      className: "px-3 py-3",
    },
    {
      Header: "Lens Gender",
      accessor: "Lens_Gender",
      className: "px-3 py-3",
    },
    {
      Header: "Lens Type",
      accessor: "Lens_Type",
      className: "px-3 py-3",
    },
    {
      Header: "LAdd",
      accessor: "LAdd",
      className: "px-3 py-3",
    },
    {
      Header: "LAxis",
      accessor: "LAxis",
      className: "px-3 py-3",
    },
    {
      Header: "LCylinder",
      accessor: "LCylinder",
      className: "px-3 py-3",
    },
    {
      Header: "LSphere",
      accessor: "LSphere",
      className: "px-3 py-3",
    },
    {
      Header: "Lens_DTS",
      accessor: "Lens_DTS",
      className: "px-3 py-3",
    },
    {
      Header: "RAdd",
      accessor: "RAdd",
      className: "px-3 py-3",
    },
    {
      Header: "RAxis",
      accessor: "RAxis",
      className: "px-3 py-3",
    },
    {
      Header: "RCylinder",
      accessor: "RCylinder",
      className: "px-3 py-3",
    },
    {
      Header: "RSphere",
      accessor: "RSphere",
      className: "px-3 py-3",
    },
    {
      Header: "Box Name",
      accessor: "Box_Names",
      className: "px-3 py-3",
    },
    {
      Header: "LBIF",
      accessor: "LLBIF",
      className: "px-3 py-3",
    },
    {
      Header: "LRBIF",
      accessor: "LRBIF",
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
  const [modalData, setModalData] = useState({
    modalPatient_id: "",
  });

  const [boxModel, setBoxModel] = useState({
    Patient_id: "",
    RSphere: "",
    RCylinder: "",
    RAxis: "",
    RAdd: "",
    LSphere: "",
    LCylinder: "",
    LAxis: "",
    LAdd: "",
  });
  const [newBoxModel, setNewBoxModel] = useState({
    Patient_id: "",
    RSphere: "",
    RCylinder: "",
    RAxis: "",
    RAdd: "",
    LSphere: "",
    LCylinder: "",
    LAxis: "",
    LAdd: "",
  });
  const [userId, setUserId] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [showblockLensModal, setShowBlockLensModal] = useState(false);
  const [showBlockedLensModel, setShowBlockedLensModel] = useState(false);
  const [activeLensId, SetActiveLensId] = useState("");
  const [activePatientId, setActivePatientId] = useState("");
  const [activePatientName, setActivePatientName] = useState("");

  const [filterPatientName, setFilterPatientName] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [csvModel, setCsvModel] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvName, setCsvName] = useState("");
  const [role, setRole] = useState('');
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    setUserId(userId);
    const role = JSON.parse(localStorage.getItem('role'));
    setRole(role);
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
      getBoxes();
    }
  }, [userId]);

  const changeHandle = (e) => {
    setBoxModel({ ...boxModel, [e.target.name]: e.target.value });
  };

  const validateForm = (formData = formData) => {
    const {
      Lens_Status,
      Lens_Gender,
      Lens_Type,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
      Lens_DTS,
      Patient_id,
      Box_id,
      LLBIF,
      LRBIF,
    } = formData;
    let error = {};
    let isError = false;
    if (!Lens_Status) {
      error.Lens_Status = "Required !";
      isError = true;
    }
    if (!Lens_Gender) {
      error.Lens_Gender = "Required !";
      isError = true;
    }
    // if (!Lens_Type) {
    //   error.Lens_Type = "Required !";
    //   isError = true;
    // }
    if (!RSphere) {
      error.RSphere = "Required !";
      isError = true;
    }
    if (!RCylinder) {
      error.RCylinder = "Required !";
      isError = true;
    }
    if (!RAxis) {
      error.RAxis = "Required !";
      isError = true;
    }
    if (!RAdd) {
      error.RAdd = "Required !";
      isError = true;
    }
    if (!LSphere) {
      error.LSphere = "Required !";
      isError = true;
    }
    if (!LCylinder) {
      error.LCylinder = "Required !";
      isError = true;
    }
    if (!LAxis) {
      error.LAxis = "Required !";
      isError = true;
    }
    if (!LAdd) {
      error.LAdd = "Required !";
      isError = true;
    }
    if (!LLBIF) {
      error.LLBIF = "Required !";
      isError = true;
    }
    if (!LRBIF) {
      error.LRBIF = "Required !";
      isError = true;
    }
    // if (!Lens_DTS) {
    //   error.Lens_DTS = "Required !";
    //   isError = true;
    // }
    // if (!Box_id) {
    //   error.Box_id = "Required !";
    //   isError = true;
    // }
    setValidation(error);
    return isError;
  };

  const changeBlockLensHandle = async (e) => {
    //setActivePatientId(e.target.value);
    if (e.target.name == "filterPatient") {
      setFilterPatientName(e.target.value);
    } else {
      setActivePatientName(e.target.value);
    }
    if (e.target.value != "") {
      const getResponse = await fetch(
        `http://localhost:8080/api/v1/patientByName?name=${e.target.value}&userId=${userId}`,
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
        console.log(data.Patient_Data);
        setPatientData(data.Patient_Data);
      } else {
        console.log("Get Failed");
      }
    } else {
      setPatientData([]);
      setBoxModel({
        Patient_id: "",
        RSphere: "",
        RCylinder: "",
        RAxis: "",
        RAdd: "",
        LSphere: "",
        LCylinder: "",
        LAxis: "",
        LAdd: "",
      });
      setNewBoxModel({
        Patient_id: "",
        RSphere: "",
        RCylinder: "",
        RAxis: "",
        RAdd: "",
        LSphere: "",
        LCylinder: "",
        LAxis: "",
        LAdd: "",
      });
    }
  };

  const selectPatient = async (patientId, patientName, filtering) => {
    if (filtering != "") {
      setFilterPatientName(patientName);

      // bind all modal form using patientId
      const response = await fetch(
        `http://localhost:8080/api/v1/patientById?id=${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNewBoxModel({
          ...data.Patient_Data,
          Patient_id: data.Patient_Data.id,
        });
        setBoxModel({
          ...data.Patient_Data,
          Patient_id: data.Patient_Data.id,
        });
      } else {
        console.log("Lens not Blocked");
      }
    } else {
      setActivePatientName(patientName);
    }
    setActivePatientId(patientId);
    setPatientData([]);
  };

  const submitBlockLensModal = async (e) => {
    e.preventDefault();
    if (activePatientId) {
      const info = {
        patient_id: activePatientId,
        lens_id: activeLensId,
      };
      const response = await fetch(`http://localhost:8080/api/v1/block`, {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      });
      if (response.ok) {
        console.log("Lens Blocked Successfully");
        getdata(false);
      } else {
        console.log("Lens not Blocked");
      }
      getdata(false);
      setShowBlockLensModal(false);
      setActivePatientId("");
      SetActiveLensId("");
      setActivePatientName("");
    }
  };

  const submitHandle = (e) => {
    e.preventDefault();
    let matched = false;
    if (
      boxModel.RSphere !== newBoxModel.RSphere ||
      boxModel.RCylinder !== newBoxModel.RCylinder ||
      boxModel.RAxis !== newBoxModel.RAxis ||
      boxModel.RAdd !== newBoxModel.RAdd ||
      boxModel.LSphere !== newBoxModel.LSphere ||
      boxModel.LCylinder !== newBoxModel.LCylinder ||
      boxModel.LAxis !== newBoxModel.LAxis ||
      boxModel.LAdd !== newBoxModel.LAdd
    ) {
      matched = true;
    }
    getdata(matched);
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeBlockLensModel = () => {
    setShowBlockLensModal(false);
    setPatientData([]);
    setActivePatientName("");
    setShowBlockedLensModel(false);
  };

  const getBoxes = async () => {
    const response = await fetch(
      `http://localhost:8080/api/v1/box?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setBoxes(data.Boxes_Data);
    } else {
      console.log("Get Failed");
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e, formData = formData) => {
    e.preventDefault();
    const {
      lensId,
      Lens_Status,
      Lens_Gender,
      Lens_Type,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
      Lens_DTS,
      Patient_id,
      Is_Blocked,
      Is_Booked,
      Box_id,
      Box_Names,
      LLBIF,
      LRBIF,
    } = formData;
    if (!validateForm(formData)) {
      const box = boxes.find((x) => x.id == Box_Names);
      const data = {
        lensId: lensId,
        Lens_Status: Lens_Status,
        Lens_Gender: Lens_Gender,
        Lens_Type: Lens_Type,
        RCylinder: RCylinder,
        RAxis: RAxis,
        RAdd: RAdd,
        RSphere: RSphere,
        LSphere: LSphere,
        LCylinder: LCylinder,
        LAxis: LAxis,
        LAdd: LAdd,
        Lens_DTS: Lens_DTS,
        Is_Blocked: Is_Blocked,
        Is_Booked: Is_Booked,
        Patient_id: Patient_id,
        LLBIF: LLBIF,
        LRBIF: LRBIF,
        Box_id: Box_Names,
        Box_Name: box ? box.Box_Name : "",
      };

      const res = await fetch(
        `http://localhost:8080/api/v1/lens?userId=${userId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (res.ok) {
        const values = await res.json();
        console.log("sadasd", values);
        getdata();
        childRef.current.resetNewRowData();
      } else {
        console.log("Post Failed");
      }

      setFormData({
        Patient_id: "",
        Lens_Status: "",
        Lens_Gender: "",
        Lens_Type: "",
        RCylinder: "",
        RSphere: "",
        RAxis: "",
        RAdd: "",
        LSphere: "",
        LCylinder: "",
        LAxis: "",
        LAdd: "",
        Lens_DTS: "",
        Is_Blocked: false,
        Is_Booked: false,
        Box_id: "",
        Box_Name: "",
        LLBIF: "",
        LRBIF: "",
      });
      // }
    }
  };

  const getdata = async (matched) => {
    const queryParams = new URLSearchParams(boxModel).toString();
    const getResponse = await fetch(
      `http://localhost:8080/api/v1/lens?${queryParams}&match=${matched}&userId=${userId}`,
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
      console.log("data.Lenses_Data", data.Lenses_Data);
      setCollectionListing(data.Lenses_Data);
    } else {
      console.log("Get Failed");
    }
  };

  const handleDelete = async (id) => {
    const data = {
      Lens_id: id,
    };
    const response = await fetch(`http://localhost:8080/api/v1/lens/`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });

    if (response.ok) {
      console.log("Deletion successful");
      getdata(false);
    } else {
      console.log("Deletion failed");
    }
  };

  function update(x) {
    setTodoEditing(true);
    setFormData({
      Lens_id: x.id,
      Patient_id: x.Patient_id,
      Lens_Status: x.Lens_Status,
      Lens_Gender: x.Lens_Gender,
      Lens_Type: x.Lens_Type,
      RCylinder: x.RCylinder,
      RSphere: x.RSphere,
      RAxis: x.RAxis,
      RAdd: x.RAdd,
      LSphere: x.LSphere,
      LCylinder: x.LCylinder,
      LAxis: x.LAxis,
      LAdd: x.LAdd,
      Lens_DTS: x.Lens_DTS,
      Is_Blocked: x.Is_Blocked,
      Is_Booked: x.Is_Booked,
      Box_id: x.Box_id,
      Box_Name: x.Box_Name,
      LLBIF: x.LLBIF,
      LRBIF: x.LRBIF,
    });
  }

  const submitEdits = async (formData) => {
    // e.preventDefault();
    if (!validateForm(formData)) {
      const box = boxes.find((x) => x.id == formData.Box_id);
      let data = {
        ...formData,
        Box_Name: box.Box_Name,
      };
      await updateLens(data);
      setFormData({
        Patient_id: "",
        Lens_Status: "",
        Lens_Gender: "",
        Lens_Type: "",
        RCylinder: "",
        RSphere: "",
        RAxis: "",
        RAdd: "",
        LSphere: "",
        LCylinder: "",
        LAxis: "",
        LAdd: "",
        Lens_DTS: "",
        Is_Blocked: false,
        Is_Booked: false,
        Box_id: "",
        Box_Name: "",
        LLBIF: "",
        LRBIF: "",
      });
      setTodoEditing(false);
    }
  };

  const openBlockLensModal = (lensId) => {
    setShowBlockLensModal(true);
    SetActiveLensId(lensId);
  };

  const openBlockedModal = (lensId, booked) => {
    if (!booked) {
      setShowBlockedLensModel(true);
      SetActiveLensId(lensId);
    }
  };

  const releaseLense = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Blocked: false,
      Patient_id: "",
    };
    await updateLens(info);
    getdata(false);
    setShowBlockedLensModel(false);
    SetActiveLensId("");
  };

  const bookLens = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Booked: true,
    };
    await updateLens(info);
    getdata(false);
    setShowBlockedLensModel(false);
    SetActiveLensId("");
  };

  const updateLens = async (info) => {
    const response = await fetch(`http://localhost:8080/api/v1/lens`, {
      method: "PUT",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (response.ok) {
      console.log("Lens Blocked Successfully");
      getdata(false);
    } else {
      console.log("Lens not Blocked");
    }
  };

  const openCsvModel = () => {
    setCsvModel(true);
  };

  const closeCsvModel = () => {
    setCsvModel(false);
    setCsvFile(null);
    setCsvName("");
  };

  const handleCsv = (e) => {
    setCsvName(e.target.value);
    setCsvFile(e.target.files[0]);
  };

  const submitCsv = async () => {
    console.log(csvFile);
    if (csvFile) {
      const formData = new FormData();
      formData.append("csv", csvFile);

      console.log(formData.get("csv"));
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/lensCsv?userId=${userId}`,
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
          closeCsvModel();
          getdata(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const ActionCell = ({ row, submitEdits, handleDelete }) => (
    <td>
      <div>
        <button
          className="btn btn-primary me-3"
          onClick={() => submitEdits(row.original)}
        >
          <strong>Edit</strong>
        </button>
        <button
          className="btn btn-primary bg-danger"
          onClick={() => handleDelete(row.original.id)}
        >
          <strong>Delete</strong>
        </button>
        {/* <button
          className="btn btn-primary bg-primary"
          style={{ marginLeft: "10px" }}
          onClick={() => navigate(`/search/${row.original.PatientId}`)}
        >
          <strong>Search</strong>
        </button> */}
      </div>
    </td>
  );

  const handleFilterChange = async (e) => {
    setCurrentLensId(e.target.value);
    const queryParams = new URLSearchParams(boxModel).toString();
    const getResponse = await fetch(
      `http://localhost:8080/api/v1/lens?${queryParams}&userId=${userId}&lensId=${e.target.value}`,
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
      console.log("data.Lenses_Data", data.Lenses_Data);
      if (e.target.value === "") {
        setFilteredLens([]);
        setCurrentLensId("");
      }
      else{
        setFilteredLens(data.Lenses_Data);
      }
      setCollectionListing(data.Lenses_Data);
    } else {
      console.log("Get Failed");
    }
  };

  const handleFiltedId = (selectedLensRow) => {
    const data = filteredLens.find((x) => x.id == selectedLensRow.id);
    setCurrentLensId(data.lensId);
    SetSelectedLensId(selectedLensRow.lensId);
    setFilteredLens([]);

    const newData = {
      lensId: data.lensId,
      Patient_id: data.Patient_id,
      Lens_Status: data.Lens_Status,
      Lens_Gender: data.Lens_Gender,
      Lens_Type: data.Lens_Type,
      RCylinder: data.RCylinder,
      RSphere: data.RSphere,
      RAxis: data.RAxis,
      RAdd: data.RAdd,
      LSphere: data.LSphere,
      LCylinder: data.LCylinder,
      LAxis: data.LAxis,
      LAdd: data.LAdd,
      Lens_DTS: data.Lens_DTS,
      Is_Blocked: data.Is_Blocked,
      Is_Booked: data.Is_Booked,
      Box_id: data.Box_id,
      Box_Name: data.Box_Name,
      LLBIF: data.LLBIF,
      LRBIF: data.LRBIF,
    };
    setCollectionListing((state) => [newData]);
  };

  return (
    <>
      <div class="col p-5">
        <div class="user_style">
          <div className="user_name">
            <h2>Lenses</h2>
            <hr className="mt-4" />
          </div>
          <div className="row search_input">
            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Lens Id"
                  name="lensId"
                  value={currentLensId}
                  onChange={(e) => {
                    handleFilterChange(e);
                  }}
                />
                <label htmlFor="selectBoxDate">Lens Id</label>
                <span className="text-danger">{validation.selectedLensId}</span>
                <div className="filter_sugestions">
                  {filteredLens &&
                    filteredLens.map((x) => {
                      return (
                        <span
                          className="d-block"
                          onClick={() => handleFiltedId(x)}
                        >
                          {x.lensId}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card rounded lenses_table">
                <ReactTable
                  ref={childRef}
                  columns={columns}
                  data={collectionListing}
                  selectOptions={boxes}
                  handleSubmit={handleSubmit}
                  setCollectionListing={setCollectionListing}
                  role={role}
                />
                {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="left-button">
        <Button onClick={openModal} className="model">
          Filter
        </Button>
      </div>

      <Modal show={showblockLensModal} onHide={closeBlockLensModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>Block Lens</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="row bg-light text-center text-dark m-0">
            <form>
              <div className="row search_input">
                <div className="col-12 p-0">
                  <div className="p-3">
                    <div className="form-floating mb-0">
                      <input
                        className="form-control"
                        name="patient_id"
                        autoComplete="off"
                        onChange={changeBlockLensHandle}
                        value={activePatientName}
                      />
                      <div className="suggestion_input">
                        {patientData.map((patient) => (
                          <button
                            type="button"
                            key={patient.id}
                            onClick={() => {
                              selectPatient(
                                patient.id,
                                `${patient.firstName} ${patient.lastName}`,
                                ""
                              );
                            }}
                          >
                            <span>{`${patient.firstName} ${patient.lastName}`}</span>
                          </button>
                        ))}
                      </div>
                      <label htmlFor="floatingInput">Patient Name</label>
                      {/* <span className="text-danger">{validation.Lens_Status}</span> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="Patient_id"></label>
                <div className="form-group col-md-4">

                </div></div> */}
              <Modal.Footer>
                <Button
                  className="btn btn-primary bg-danger"
                  variant="secondary"
                  onClick={closeBlockLensModel}
                >
                  Cancel
                </Button>
                <Button
                  className="btn btn-primary bg-success"
                  variant="primary"
                  onClick={submitBlockLensModal}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showBlockedLensModel} onHide={closeBlockLensModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>Blocked lens</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Modal.Footer>
            <Button
              className="btn btn-primary bg-danger"
              variant="secondary"
              onClick={releaseLense}
            >
              Release
            </Button>
            <Button
              className="btn btn-primary bg-success"
              variant="primary"
              onClick={bookLens}
            >
              Book
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <Modal show={csvModel} onHide={closeCsvModel}>
        <Modal.Header closeButton className=" bg-light">
          <Modal.Title>Import Excel File</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-lg-4">
          <div class="import_file">
            <input
              type="file"
              className="form-control"
              name="csvFile"
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
    </>
  );
};

export default Lenses;
