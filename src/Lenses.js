import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap';
import InlineEditingTable from './InlineEditingTable';
import { useNavigate } from 'react-router';
import moment from 'moment';
import ReactTable from './ReactTable';

const Lenses = () => {
  const [formData, setFormData] = useState({
    id : '',
    lensId : '',
    Box_id: '',
    Box_Name: '',
    Lens_Status: '',
    Lens_Gender: '',
    Lens_Type: '',
    RSphere: '',
    RCylinder: '',
    RAxis: '',
    RAdd: '',
    LSphere: '',
    LCylinder: '',
    LAxis: '',
    LAdd: '',
    Lens_DTS: '',
    Is_Blocked: false,
    Is_Booked: false,
    Patient_id: "",
    LLBIF:"",
    LRBIF:""
  });
  // const [pidvalid, setPidvalid] = useState({});
  const navigate = useNavigate();
  const [validation, setValidation] = useState({});
  const [modelvalid, setModelvalid] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [patientData, setPatientData] = useState([])
  const childRef = useRef();
  const columns = [
    {
      Header: 'Id',
      accessor: 'LensId',
      className: 'px-3 py-3',
    },
    {
      Header: 'Lens Status',
      accessor: 'Lens_Status',
      className: 'px-3 py-3',
    },
    {
      Header: 'Lens Gender',
      accessor: 'Lens_Gender',
      className: 'px-3 py-3',
    },
    {
      Header: 'Lens Type',
      accessor: 'Lens_Type',
      className: 'px-3 py-3',
    },
    {
      Header: 'LAdd',
      accessor: 'LAdd',
      className: 'px-3 py-3',
    },
    {
      Header: 'LAxis',
      accessor: 'LAxis',
      className: 'px-3 py-3',
    },
    {
      Header: 'LCylinder',
      accessor: 'LCylinder',
      className: 'px-3 py-3',
    },
    {
      Header: 'LSphere',
      accessor: 'LSphere',
      className: 'px-3 py-3',
    },
    {
      Header: 'Lens_DTS',
      accessor: 'Lens_DTS',
      className: 'px-3 py-3',
    },
    {
      Header: 'RAdd',
      accessor: 'RAdd',
      className: 'px-3 py-3',
    },
    {
      Header: 'RAxis',
      accessor: 'RAxis',
      className: 'px-3 py-3',
    },
    {
      Header: 'RCylinder',
      accessor: 'RCylinder',
      className: 'px-3 py-3',
    },
    {
      Header: 'RSphere',
      accessor: 'RSphere',
      className: 'px-3 py-3',
    },
    {
      Header: 'Box Name',
      accessor: 'Box Names',
      className: 'px-3 py-3',
    },
    {
      Header: 'LBIF',
      accessor: 'LBIF',
      className: 'px-3 py-3',
    },
    {
      Header: 'LRBIF',
      accessor: 'LRBIF',
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
  const [modalData, setModalData] = useState({
    modalPatient_id: ''

  })

  const [boxModel, setBoxModel] = useState({
    Patient_id: '', RSphere: '', RCylinder: '', RAxis: '', RAdd: '', LSphere: '', LCylinder: '', LAxis: '', LAdd: ''
  })
  const [newBoxModel, setNewBoxModel] = useState({
    Patient_id: '', RSphere: '', RCylinder: '', RAxis: '', RAdd: '', LSphere: '', LCylinder: '', LAxis: '', LAdd: ''
  })
  const [userId, setUserId] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [showblockLensModal, setShowBlockLensModal] = useState(false)
  const [showBlockedLensModel, setShowBlockedLensModel] = useState(false)
  const [activeLensId, SetActiveLensId] = useState("");
  const [activePatientId, setActivePatientId] = useState("")
  const [activePatientName, setActivePatientName] = useState("")

  const [filterPatientName, setFilterPatientName] = useState("")
  const [boxes, setBoxes] = useState([])
  const [csvModel, setCsvModel] = useState(false)
  const [csvFile, setCsvFile] = useState(null);
  const [csvName, setCsvName] = useState('');

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId'))
    setUserId(userId)
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
      getBoxes();
    }
}, [userId]);

  const changeHandle = (e) => {
    setBoxModel({ ...boxModel, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { Lens_Status, Lens_Gender, Lens_Type, RSphere, RCylinder, RAxis, RAdd, LSphere, LCylinder, LAxis, LAdd, Lens_DTS, Patient_id, Box_id, LLBIF,LRBIF } = formData;
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
    if (e.target.name == 'filterPatient') {
      setFilterPatientName(e.target.value);
    }
    else {
      setActivePatientName(e.target.value);
    }
    if (e.target.value != '') {
      const getResponse = await fetch(`http://localhost:8080/api/v1/patientByName?name=${e.target.value}&userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': JSON.parse(localStorage.getItem('token'))
        }
      });
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log(data.Patient_Data);
        setPatientData(data.Patient_Data);
      } else {
        console.log('Get Failed');
      }

    }
    else {
      setPatientData([]);
      setBoxModel({
        Patient_id: '', RSphere: '', RCylinder: '', RAxis: '', RAdd: '', LSphere: '', LCylinder: '', LAxis: '', LAdd: ''
      })
      setNewBoxModel({
        Patient_id: '', RSphere: '', RCylinder: '', RAxis: '', RAdd: '', LSphere: '', LCylinder: '', LAxis: '', LAdd: ''
      })
    }
  }

  const selectPatient = async (patientId, patientName, filtering) => {
    if (filtering != '') {
      setFilterPatientName(patientName)

      // bind all modal form using patientId
      const response = await fetch(`http://localhost:8080/api/v1/patientById?id=${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage.getItem('token'))
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNewBoxModel({
          ...data.Patient_Data,
          Patient_id: data.Patient_Data.id
        })
        setBoxModel({
          ...data.Patient_Data,
          Patient_id: data.Patient_Data.id
        });
      } else {
        console.log('Lens not Blocked');
      }

    }
    else {
      setActivePatientName(patientName);
    }
    setActivePatientId(patientId);
    setPatientData([]);
  }

  const submitBlockLensModal = async (e) => {
    e.preventDefault();
    if(activePatientId){
      const info = {
        patient_id: activePatientId,
        lens_id: activeLensId
      }
      const response = await fetch(`http://localhost:8080/api/v1/block`, {
        method: 'PUT',
        body: JSON.stringify(info),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage.getItem('token'))
        },
      });
      if (response.ok) {
        console.log('Lens Blocked Successfully');
        getdata(false);
      } else {
        console.log('Lens not Blocked');
      }
      getdata(false);
      setShowBlockLensModal(false);
      setActivePatientId("")
      SetActiveLensId("")
      setActivePatientName('')
    }
  }

  const submitHandle = (e) => {
    e.preventDefault();
    let matched = false;
    if (boxModel.RSphere !== newBoxModel.RSphere ||
      boxModel.RCylinder !== newBoxModel.RCylinder ||
      boxModel.RAxis !== newBoxModel.RAxis ||
      boxModel.RAdd !== newBoxModel.RAdd ||
      boxModel.LSphere !== newBoxModel.LSphere ||
      boxModel.LCylinder !== newBoxModel.LCylinder ||
      boxModel.LAxis !== newBoxModel.LAxis ||
      boxModel.LAdd !== newBoxModel.LAdd
    ) {
      matched = true
    }
    getdata(matched);
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeBlockLensModel = () => {
    setShowBlockLensModal(false)
    setPatientData([]);
    setActivePatientName('')
    setShowBlockedLensModel(false);
  }

  const getBoxes = async () => {
    const response = await fetch(`http://localhost:8080/api/v1/box?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (response.ok) {
      const data = await response.json();
      setBoxes(data.Boxes_Data);
    } else {
      console.log('Get Failed');
    }
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };


  const handleSubmit = async (e, formData = formData) => {
    e.preventDefault();
    const { Lens_Status, Lens_Gender, Lens_Type, RSphere, RCylinder, RAxis, RAdd, LSphere, LCylinder, LAxis, LAdd, Lens_DTS, Patient_id, Is_Blocked, Is_Booked, Box_id, Box_Name, LLBIF,LRBIF } = formData;
    if (!validateForm()) {
      const box = boxes.find(x => x.id == Box_id);
      const data = {
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
        LLBIF:LLBIF,
        LRBIF:LRBIF,
        Box_id: Box_id ? Box_id : null,
        Box_Name: box ? box.Box_Name : ''
      }

      const res = await fetch(`http://localhost:8080/api/v1/lens?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          'Authorization': JSON.parse(localStorage.getItem('token'))
        }
      });
      if (res.ok) {
        const values = await res.json();
        getdata();
        childRef.current.resetNewRowData();
      }
      else {
        console.log('Post Failed')
      }

      setFormData({
        Patient_id: "",
        Lens_Status: "",
        Lens_Gender: "",
        Lens_Type: "",
        RCylinder: '',
        RSphere: '',
        RAxis: '',
        RAdd: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LAdd: '',
        Lens_DTS: '',
        Is_Blocked: false,
        Is_Booked: false,
        Box_id: "",
        Box_Name: '',
        LLBIF:"",
        LRBIF:""
      })
      // }
    }
  };

  const getdata = async (matched) => {
    const queryParams = new URLSearchParams(boxModel).toString();
    const getResponse = await fetch(`http://localhost:8080/api/v1/lens?${queryParams}&match=${matched}&userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('data.Lenses_Data', data.Lenses_Data);
      setCollectionListing(data.Lenses_Data);
    } else {
      console.log('Get Failed');
    }

  }

  const handleDelete = async (id) => {
    const data = {
      Lens_id: id
    };
    const response = await fetch(`http://localhost:8080/api/v1/lens/`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }
    });

    if (response.ok) {
      console.log('Deletion successful');
      getdata(false);
    } else {
      console.log('Deletion failed');
    }
  }

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
      LLBIF:x.LLBIF,
      LRBIF:x.LRBIF
    })
  }

  const submitEdits = async (e) => {
    // e.preventDefault();
    if (!validateForm()) {
      const box = boxes.find(x => x.id == formData.Box_id)
      let data = {
        ...formData,
        Box_Name : box.Box_Name
      }
      await updateLens(data)
      setFormData({
        Patient_id: "",
        Lens_Status: "",
        Lens_Gender: "",
        Lens_Type: "",
        RCylinder: '',
        RSphere: '',
        RAxis: '',
        RAdd: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LAdd: '',
        Lens_DTS: '',
        Is_Blocked: false,
        Is_Booked: false,
        Box_id: "",
        Box_Name: "",
        LLBIF:"",
        LRBIF:""
      })
      setTodoEditing(false);
    }
  }

  const openBlockLensModal = (lensId) => {
    setShowBlockLensModal(true)
    SetActiveLensId(lensId)
  }

  const openBlockedModal = (lensId, booked) => {
    if (!booked) {
      setShowBlockedLensModel(true)
      SetActiveLensId(lensId)
    }
  }

  const releaseLense = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Blocked: false,
      Patient_id: "",
    }
    await updateLens(info)
    getdata(false);
    setShowBlockedLensModel(false);
    SetActiveLensId("")
  }

  const bookLens = async (e) => {
    e.preventDefault();
    const info = {
      //patient_id: activePatientId,
      Lens_id: activeLensId,
      Is_Booked: true
    }
    await updateLens(info)
    getdata(false);
    setShowBlockedLensModel(false);
    SetActiveLensId("")
  }

  const updateLens = async (info) => {
    const response = await fetch(`http://localhost:8080/api/v1/lens`, {
      method: 'PUT',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
    });
    if (response.ok) {
      console.log('Lens Blocked Successfully');
      getdata(false);
    } else {
      console.log('Lens not Blocked');
    }
  }

  const openCsvModel = () => {
    setCsvModel(true)
  }

  const closeCsvModel = () => {
    setCsvModel(false)
    setCsvFile(null)
    setCsvName("")
  }

  const handleCsv = (e) => {
    setCsvName(e.target.value)
    setCsvFile(e.target.files[0])
  }

  const submitCsv = async () => {
    console.log(csvFile)
    if (csvFile) {
      const formData = new FormData();
      formData.append('csv', csvFile);

      console.log(formData.get('csv'))
      try {
        const response = await fetch(`http://localhost:8080/api/v1/lensCsv?userId=${userId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': JSON.parse(localStorage.getItem('token'))
          },
        });
        if (response.ok) {
          const data = await response.json();
          closeCsvModel();
          getdata(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
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
        <button className="btn btn-primary bg-primary" style={{marginLeft:"10px"}} onClick={() => navigate(`/analysis/${row.original.PatientId}`)}>
          <strong>Analyse</strong>
        </button>
      </div>
    </td>
  );

  return (
    <>
      <div class="col p-5">
        <div class="user_style">
          <div className="user_name">
            <h2>Lenses</h2>
            <hr className="mt-4" />
          </div>
          {/* <div className="row">
            <div className="col-12 mb-3 mt-3">
              <label className="form_title">Right Eye</label>
            </div>
          </div>
          <div className='row search_input'>
            <div className='col-12'>


              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Status"
                  name='Lens_Status'
                  value={formData.Lens_Status}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Lens Status</label>
                <span className="text-danger">{validation.Lens_Status}</span>
              </div>
            </div>
          </div> */}
          {/* <div className="row search_input">
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder=" Lens Gender"
                  name='Lens_Gender'
                  value={formData.Lens_Gender}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Lens Gender</label>
                <span className="text-danger">{validation.Lens_Gender}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Lens Type"
                  name='Lens_Type'
                  value={formData.Lens_Type}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Lens Type</label>
                <span className="text-danger">{validation.Lens_Type}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Sphere"
                  name='RSphere'
                  value={formData.RSphere}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">R Sphere</label>
                <span className="text-danger">{validation.RSphere}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="LR BIF"
                  name='LRBIF'
                  value={formData.LRBIF}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">LR BIF</label>
                <span className="text-danger">{validation.LRBIF}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Axis"
                  name='RAxis'
                  value={formData.RAxis}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">R Axis</label>
                <span className="text-danger">{validation.RAxis}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Sphere"
                  name='LSphere'
                  value={formData.LSphere}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">L Sphere</label>
                <span className="text-danger">{validation.LSphere}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Axis"
                  name='LAxis'
                  value={formData.LAxis}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">L Axis</label>
                <span className="text-danger">{validation.LAxis}</span>
              </div>
              
              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  id="floatingInput"
                  placeholder="Box Name"
                  name="Box_id"
                  onChange={handleChange}
                  value={formData.Box_id}
                >
                  <option disabled selected value="">Select a Name</option>
                  {
                    boxes.map((val, index) => {
                      return (
                        <option value={val.id}>{val.Box_Name}</option>
                      );
                    })
                  }
                </select>
                <label htmlFor="floatingInput">Box Name</label>
                <span className="text-danger">{validation.Box_id}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Lens dts"
                  name='Lens_DTS'
                  value={formData.Lens_DTS}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Lens dts</label>
                <span className="text-danger">{validation.Lens_DTS}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Cylinder"
                  name='RCylinder'
                  value={formData.RCylinder}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">R Cylinder</label>
                <span className="text-danger">{validation.RCylinder}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Add"
                  name='RAdd'
                  value={formData.RAdd}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">R Add</label>
                <span className="text-danger">{validation.RAdd}</span>
              </div>
            </div>
            <div className="col">

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Cylinder"
                  name='LCylinder'
                  value={formData.LCylinder}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">L Cylinder</label>
                <span className="text-danger">{validation.LCylinder}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Add"
                  name='LAdd'
                  value={formData.LAdd}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">L Add</label>
                <span className="text-danger">{validation.LAdd}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="LL BIF"
                  name='LLBIF'
                  value={formData.LLBIF}
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">LL BIF</label>
                <span className="text-danger">{validation.LLBIF}</span>
              </div>
              <div className="form-floating mb-3 d-flex align-items-center">
                <button className="btn btn-primary w-100" onClick={openCsvModel}>Import</button>
                <button className="btn btn-primary w-100 ms-2" onClick={todoEditing === true ? submitEdits : handleSubmit}>{!todoEditing ? <span>Submit</span> : <span>Update</span>}</button>
                <div className="dropdown ms-2">
                  <div>
                    <div className="left-button">
                      <Button onClick={openModal} className='model btn btn-primary w-100 ms-2 trasparent d-flex align-items-center  justify-content-between'>
                        <span>Filter</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-funnel ms-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"
                          />
                        </svg>
                      </Button>
                    </div>

                    <Modal show={isOpen} onHide={closeModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Filter</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className='p-0'>
                        <div className="bg-light text-center text-dark m-0 p-3">
                          <div className='row '>
                            <form>

                              <div className="row search_input">
                                <div className="col">
                                  <div className="form-floating position-relative mb-3">
                                    <input className="form-control" name='filterPatient' autoComplete="off" onChange={changeBlockLensHandle} value={filterPatientName} />
                                    {
                                      patientData.length > 0 &&
                                      <div class="suggestion_input filter_suggestion">
                                        {
                                          patientData.map((patient) => (
                                            <button type='button' key={patient.id} onClick={() => { selectPatient(patient.id, `${patient.firstName} ${patient.lastName}`, 'filtering') }}><span>{`${patient.firstName} ${patient.lastName}`}</span></button>
                                          ))
                                        }
                                      </div>
                                    }

                                    <label htmlFor="floatingInput">Patient Name</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="RSphere" value={boxModel.RSphere} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">RSphere</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="RCylinder" value={boxModel.RCylinder} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">RCylinder</label>
                                  </div>
                                </div>
                              </div>

                              <div className="row search_input">
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="RAxis" value={boxModel.RAxis} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">RAxis</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="RAdd" value={boxModel.RAdd} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">RAdd</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="LSphere" value={boxModel.LSphere} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">LSphere</label>
                                  </div>
                                </div>
                              </div>

                              <div className="row search_input">
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="LCylinder" value={boxModel.LCylinder} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">LCylinder</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="LAxis" value={boxModel.LAxis} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">LAxis</label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input className="form-control" type="text" name="LAdd" value={boxModel.LAdd} onChange={changeHandle} />
                                    <label htmlFor="floatingInput">LAdd</label>
                                  </div>
                                </div>
                              </div>



                              <Modal.Footer>
                                <Button className="btn btn-primary bg-danger me-3" variant="secondary" onClick={closeModal}>Cancel</Button>
                                <Button className="btn btn-primary" variant="primary" onClick={submitHandle}>Submit</Button>
                              </Modal.Footer>
                            </form>
                          </div>
                        </div>

                      </Modal.Body>

                    </Modal>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
          
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card rounded lenses_table">
                 <ReactTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit}/>
                {/* <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="left-button">
        <Button onClick={openModal} className='model'>Filter</Button>
      </div>

      <Modal show={showblockLensModal} onHide={closeBlockLensModel}>
        <Modal.Header closeButton className=' bg-light'>
          <Modal.Title>Block Lens</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <div className='row bg-light text-center text-dark m-0'>
            <form>
              <div className='row search_input'>
                <div className='col-12 p-0'>
                  <div className='p-3'>
                    <div className="form-floating mb-0">
                      <input className="form-control" name='patient_id' autoComplete="off" onChange=
                        {changeBlockLensHandle} value={activePatientName} />
                      <div className='suggestion_input'>
                        {
                          patientData.map((patient) => (
                            <button type='button' key={patient.id} onClick={() => { selectPatient(patient.id, `${patient.firstName} ${patient.lastName}`, '') }}><span>{`${patient.firstName} ${patient.lastName}`}</span></button>

                          ))
                        }
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
                <Button className='btn btn-primary bg-danger' variant="secondary" onClick={closeBlockLensModel}>Cancel</Button>
                <Button className='btn btn-primary bg-success' variant="primary" onClick={submitBlockLensModal}>Submit</Button>
              </Modal.Footer>
            </form>
          </div>
        </Modal.Body>
      </Modal>


      <Modal show={showBlockedLensModel} onHide={closeBlockLensModel}>
        <Modal.Header closeButton className=' bg-light'>
          <Modal.Title>Blocked lens</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <Modal.Footer>
            <Button className='btn btn-primary bg-danger' variant="secondary" onClick={releaseLense}>Release</Button>
            <Button className='btn btn-primary bg-success' variant="primary" onClick={bookLens}>Book</Button>
          </Modal.Footer>

        </Modal.Body>
      </Modal>


      <Modal show={csvModel} onHide={closeCsvModel}>
        <Modal.Header closeButton className=' bg-light'>
          <Modal.Title>Import Excel File</Modal.Title>
        </Modal.Header>
        <Modal.Body className='py-4 px-lg-4'>
          <div class="import_file">
            <input type='file' className="form-control" name='csvFile' onChange=
              {(e) => { handleCsv(e) }} value={csvName} />
          </div>
        </Modal.Body>
        <Modal.Footer className=' bg-light'>
          <Button className='btn btn-primary bg-danger' variant="secondary" onClick={closeCsvModel}>Cancel</Button>
          <Button className='btn btn-primary bg-success' variant="primary" onClick={submitCsv}>Submit</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default Lenses