import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import InlineEditingTable from "./InlineEditingTable";
import { useNavigate } from "react-router";
import moment from "moment";
import ReactTable from "./ReactTable";
import { toast } from 'react-toastify';
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';
const Lenses = () => {
  const [formData, setFormData] = useState({
    id: "",
    lensId: "",
    Collection_id: "",
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
    // LLBIF: "",
    // LRBIF: "",
  });
  // const [pidvalid, setPidvalid] = useState({});
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [modelvalid, setModelvalid] = useState({});
  const [filteredLens, setFilteredLens] = useState([]);
  const [currentLensId, setCurrentLensId] = useState("");
  const [collectionListing, setCollectionListing] = useState([]);
  const [collectionById, setCollectionById] = useState([]);
  const [collection, setCollection] = useState([]);
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
    // {
    //   Header: "Collection Id",
    //   accessor: "Collection_id",
    //   className: "px-3 py-3",
    // },
    {
      Header: "Lens Gender",
      accessor: "Lens_Gender",
      className: "px-3 py-3",
    },
    {
      Header: "RSphere",
      accessor: "RSphere",
      className: "px-3 py-3",
    },
    {
      Header: "RCylinder",
      accessor: "RCylinder",
      className: "px-3 py-3",
    },
    {
      Header: "RAxis",
      accessor: "RAxis",
      className: "px-3 py-3",
    },
    {
      Header: "RAdd",
      accessor: "RAdd",
      className: "px-3 py-3",
    },

    {
      Header: "LSphere",
      accessor: "LSphere",
      className: "px-3 py-3",
    },
    {
      Header: "LCylinder",
      accessor: "LCylinder",
      className: "px-3 py-3",
    },
    {
      Header: "LAxis",
      accessor: "LAxis",
      className: "px-3 py-3",
    },
    {
      Header: "LAdd",
      accessor: "LAdd",
      className: "px-3 py-3",
    },
    {
      Header: "Lens Type",
      accessor: "Lens_Type",
      className: "px-3 py-3",
    },
    {
      Header: "Lens_DTS",
      accessor: "Lens_DTS",
      className: "px-3 py-3",
    },
    // {
    //   Header: "Box Name",
    //   accessor: "Box_Names",
    //   className: "px-3 py-3",
    // },
    // {
    //   Header: "LBIF",
    //   accessor: "LLBIF",
    //   className: "px-3 py-3",
    // },
    // {
    //   Header: "LRBIF",
    //   accessor: "LRBIF",
    //   className: "px-3 py-3",
    // },
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
  const [role, setRole] = useState("");
  const [collId, setCollId] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    const collId = JSON.parse(localStorage.getItem("collId"));
    const selectedColID = localStorage.getItem('selectedLensCollectionId');
    setSelectedCollectionId(selectedColID);
    const userId = JSON.parse(localStorage.getItem("userId"));
    setRole(role);
    if (userId) {
      setUserId(userId);
    }
    else {
      navigate('/')
    }

    setCollId(collId)
  }, []);

  // useEffect(() => {
  //   if (userId) {
  //     if (role == 1) getdata();
  //     if (role !== 1) {
  //       getColldata();
  //       getlensByCollId();
  //     }

  //   }
  // }, [userId]);
  useEffect(() => {
    if (!userId) return;
    if (role == 1) {
      // getdata();
      getAllCollection();
    } else {
      getlensByCollId();
    }

    getColldata();
  }, [userId, role]);

  const getAllCollection = async () => {

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
        Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
      }));
      setCollectionById(collectionData);
      // handleSelectChange("", collectionData[0]?.id)
      //  handleSelectChange("", selectedCollectionId)
      let selectedCollId;
      selectedCollId = selectedCollectionId || collectionData[0]?.id;
      handleSelectChange("", selectedCollId)
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  }
  const changeHandle = (e) => {
    setBoxModel({ ...boxModel, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    getColldata();
  }, [userId]);
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
        Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
      }));
      setCollection(collectionData);
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  };
  const handleSelectChange = async (e, id) => {
    if (e?.target?.value) {
      var id = e.target.value;
    }
    localStorage.setItem('selectedLensCollectionId', id);
    setSelectedCollectionId(id);
    setCurrentLensId("");
    setFilteredLens([]);
    const getResponse = await fetch(
      // `${API_URL}/v1/lensesByCollectionId?collectionId=${e.target.value}`,
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
      const collectionData = data.lensesData.map((x) => ({
        ...x
      }));
      setCollectionListing(collectionData);
    } else {
      console.log("Get Failed");
    }

  };
  const getlensByCollId = async () => {
    const getResponse = await fetch(
      `${API_URL}/v1/getCollectionsByIds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
        body: JSON.stringify({ collectionIds: collId }),
      }
    );

    if (getResponse.ok) {
      const data = await getResponse.json();
      const collectionData = data.Collection_Data.map((x) => ({
        ...x,
        Coll_date: moment(x.Coll_date).format("YYYY-MM-DD"),
      }));
      setCollectionById(collectionData);
      // handleSelectChange("", collectionData[0]?.id)
      let selectedCollId;
      selectedCollId = selectedCollectionId || collectionData[0].id;
      handleSelectChange("", selectedCollId)
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Post Failed");
      }
    }
  }

  const getdata = async (matched) => {
    const queryParams = new URLSearchParams(boxModel).toString();
    const getResponse = await fetch(
      `${API_URL}/v1/lens?${queryParams}&match=${matched}&userId=${userId}`,
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
      setCollectionListing(data.Lenses_Data);
    } else {
      console.log("Get Failed");
    }
  };

  const validateForm = (formData = formData) => {
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
      Box_id,
      // LLBIF,
      // LRBIF,
    } = formData;
    let error = {};
    let isError = false;
    if (!lensId) {
      toast.error('Please fill valid input ');
      error.lensId = "Required !";
      isError = true;
    }
    else if (!Lens_Status) {
      toast.error('Please select Lens_Status ');
      error.Lens_Status = "Required !";
      isError = true;
    }
    // else if (!Lens_Gender) {
    //   toast.error('Please fill valid input ');
    //   error.Lens_Gender = "Required !";
    //   isError = true;
    // }
    // else if (!RSphere && !LSphere) {
    //   toast.error('Please fill Sphere');
    //   error.RSphere = "Required !";
    //   isError = true;
    // }
    // else if (!RAxis && !LAxis) {
    //   toast.error('Please fill Axis');
    //   error.RSphere = "Required !";
    //   isError = true;
    // }
    // else if (!LAdd && !RAdd) {
    //   toast.error('Please fill Add');
    //   error.RSphere = "Required !";
    //   isError = true;
    // }

    //  if (/[A-Za-z]/.test(RSphere) || /[A-Za-z]/.test(LSphere)) {
    //   toast.error('Sphere should not contain alphabets');
    //   error.RSphere = "Should not contain alphabets!";
    //   isError = true;
    // }
    if ((RSphere !== null && /[A-Za-z]/.test(RSphere)) || (LSphere !== null && /[A-Za-z]/.test(LSphere))) {
      toast.error('Sphere should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }


    else if ((RCylinder !== null && /[A-Za-z]/.test(RCylinder)) || (LCylinder !== null && /[A-Za-z]/.test(LCylinder))) {
      toast.error('Cylinder should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }

    else if ((RAxis !== null && /[A-Za-z]/.test(RAxis)) || (LAxis !== null && /[A-Za-z]/.test(LAxis))) {
      toast.error('Axis should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }

    else if ((LAdd !== null && /[A-Za-z]/.test(LAdd)) || (RAdd !== null && /[A-Za-z]/.test(RAdd))) {
      toast.error('Add should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }
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
        `${API_URL}/v1/patientByName?name=${e.target.value}&userId=${userId}`,
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
        `${API_URL}/v1/patientById?id=${patientId}`,
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
      const response = await fetch(`${API_URL}/v1/block`, {
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
      `${API_URL}/v1/box?userId=${userId}`,
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
      Collection_id,
      // LLBIF,
      // LRBIF,
    } = formData;

    if (!validateForm(formData)) {
      // const box = boxes.find((x) => x.id == Box_Names);
      const data = {
        lensId: lensId,
        Lens_Status: Lens_Status,
        Lens_Gender: Lens_Gender,
        Lens_Type: Lens_Type,
        RCylinder: RCylinder || "0",
        RAxis: RAxis || "0",
        RAdd: RAdd || "0",
        RSphere: RSphere || "0",
        LSphere: LSphere || "0",
        LCylinder: LCylinder || "0",
        LAxis: LAxis || "0",
        LAdd: LAdd || "0",
        Lens_DTS: Lens_DTS,
        Is_Blocked: Is_Blocked,
        Is_Booked: Is_Booked,
        Patient_id: Patient_id,
        isReading: Lens_Status === "reading" ? true : false,
        // CollectionId: Collection_id || selectedCollectionId
        CollectionId: selectedCollectionId
        // LLBIF: LLBIF,
        // LRBIF: LRBIF,
        // Box_id: Box_Names,
        // Box_Name: box ? box.Box_Name : "",
      };

      const res = await fetch(
        `${API_URL}/v1/lens?userId=${userId}`,
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
        // getdata();
        getAllCollection();
        childRef.current.resetNewRowData();
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
          Collection_id: "",
          // LLBIF: "",
          // LRBIF: "",
        });
      } else {
        console.log("Post Failed");
        toast.error('Lens with the provided lensId already exists');
      }


      // }
    }
  };

  const handleDelete = async (id) => {
    const data = {
      Lens_id: id,
    };
    const response = await fetch(`${API_URL}/v1/lens/`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });

    if (response.ok) {
      console.log("Deletion successful");
      // getdata(false);
      getAllCollection();
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
      CollectionId: x?.Collection_id,
      // LLBIF: x.LLBIF,
      // LRBIF: x.LRBIF,
    });
  }

  const submitEdits = async (formData) => {
    // e.preventDefault();
    if (!validateForm(formData)) {
      // const box = boxes.find((x) => x.id == formData.Box_id);
      const box = collectionListing.find((x) => x.id == formData.id);
      let data = {
        ...formData,
        Box_Name: box.Box_Name,
        isReading: box.Lens_Status === "reading" ? true : false,
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
        Collection_id: "",
        // LLBIF: "",
        // LRBIF: "",
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
    const response = await fetch(`${API_URL}/v1/lens`, {
      method: "PUT",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (response.ok) {
      console.log("Lens Blocked Successfully");
      // getdata(false);
      getAllCollection();
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
    if (csvFile) {
      const formData = new FormData();
      formData.append("csv", csvFile);
      try {
        const response = await fetch(
          `${API_URL}/v1/lensCsv?userId=${userId}`,
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
          {/* //<strong>Edit</strong> */}
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
          onClick={() => handleDelete(row.original.id)}
        >
          {/* //<strong>Delete</strong> */}
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
    // if (role == 1) {
    //   const getResponse = await fetch(
    //     `${API_URL}/v1/lens?${queryParams}&userId=${userId}&lensId=${e.target.value}`,
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
    //     if (e.target.value === "") {
    //       setFilteredLens([]);
    //       setCurrentLensId("");
    //     } else {
    //       setFilteredLens(data.Lenses_Data);
    //     }

    //     setCollectionListing(data.Lenses_Data);
    //   } else {
    //     console.log("Get Failed");
    //   }
    // } else {
    const getResponse = await fetch(
      `${API_URL}/v1/getLensById?lensId=${e.target.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
        // body: JSON.stringify({ collectionIds: collId }),
        body: JSON.stringify({ collectionIds: selectedCollectionId }),
      }
    );
    if (getResponse.ok) {
      const data = await getResponse.json();
      if (e.target.value === "") {
        setFilteredLens([]);
        setCurrentLensId("");
      } else {
        setFilteredLens(data.Lenses_Data);
      }
      setCollectionListing(data.Lenses_Data);
    } else {
      console.log("Get Failed");
    }
    // }

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
      // LLBIF: data.LLBIF,
      // LRBIF: data.LRBIF,
    };
    setCollectionListing((state) => [newData]);
  };

  return (
    <>
      <div class="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
        <div class="user_style lenses_page">
          <div className="row search_input g-3">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-lg-0">
              <div className="form-floating">
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
                {/* <div className="filter_sugestions"> */}
                <div className={filteredLens.length > 0 ? "filter_suggestions" : ""}>
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

            {/* <div className="col-lg-2 col-md-3 col-sm-12 co-12 mt-lg-0 mt-md-0 mt-3">
              <div className="left-button">
                <Button  className="model">
                  Filter
                </Button>
              </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-sm-12 col-12  mt-lg-0" >

              <div className="form-floating">
                <select
                  id="collectionSelect"
                  className="form-control form-select"
                  value={selectedCollectionId}
                  onChange={(e) => handleSelectChange(e, "")}
                >
                  <option value="">Select a Collection</option>
                  {collectionById.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.Coll_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="collectionSelect">Select Collection:</label>
              </div>
            </div>
          </div>


          {/* <div className="formControl select" style={{ textAlign: 'center', marginTop: '-55px'}}>
          {role != 1 && (
            <div>
              <label htmlFor="collectionSelect">Select Collection:</label>
              <select
                id="collectionSelect"
                value={selectedCollectionId}
                onChange={(e) => handleSelectChange(e, '')}
              >
                <option value="">Select a Collection</option>
                {collectionById.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.Coll_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          </div> */}


          <div className="row mt-0">
            <div className="col-12">
              <div className=" lenses_table overflow-auto mt-3">
                <ReactTable
                  ref={childRef}
                  columns={columns}
                  data={collectionListing}
                  selectOptions={boxes}
                  handleSubmit={handleSubmit}
                  setCollectionListing={setCollectionListing}
                  role={role}
                  submitEdits={submitEdits}
                  collectionListing={collection}
                  tableType='lens'
                />
                {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
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
