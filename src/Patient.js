import React, { useState, useEffect, useRef } from 'react'
import InlineEditingTable from './InlineEditingTable';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { toast } from 'react-toastify';
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';
const patientInfo = {
  id: '',
  PatientId: '',
  CollectionID:'',
  Box_id: '',
  Lens_Status: '',
  Lens_Gender: '',
  RSphere: '',
  RCylinder: '',
  RAxis: '',
  RAdd: '',
  LSphere: '',
  LCylinder: '',
  LAxis: '',
  LAdd: '',
}

const Patient = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(patientInfo);
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState({});
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  // const [selectedId, setSelectedCollectionId] = useState('');
  const [collName, setCollName] = useState('');
  const childRef = useRef();
  const [role, setRole] = useState("");
  const columns = [
    {
      Header:`${collName} `,
      columns: [
        {
          Header: 'Patient Id',
          accessor: 'PatientId',
          className: 'px-3 py-3',
        },
      ],
    },
    {
      Header: 'Right Lens',
      columns: [
        {
          Header: 'Sphere',
          accessor: 'RSphere',
          className: 'px-3 py-3',
        },
        {
          Header: 'Cylinder',
          accessor: 'RCylinder',
          className: 'px-3 py-3',
        },
        {
          Header: 'Axis',
          accessor: 'RAxis',
          className: 'px-3 py-3',
        },
        {
          Header: 'Add',
          accessor: 'RAdd',
          className: 'px-3 py-3',
        },
      ],
    },
    {
      Header: 'Left Lens',
      columns: [
        {
          Header: 'Sphere',
          accessor: 'LSphere',
          className: 'px-3 py-3',
        },
        {
          Header: 'Cylinder',
          accessor: 'LCylinder',
          className: 'px-3 py-3',
        },
        {
          Header: 'Axis',
          accessor: 'LAxis',
          className: 'px-3 py-3',
        },
        {
          Header: 'Add',
          accessor: 'LAdd',
          className: 'px-3 py-3',
        },
      ],
    },
    {
      Header: '.',
      columns: [
        {
          Header: 'Status',
          accessor: 'Lens_Status',
          className: 'px-3 py-3',
        }
        ,
        {
          Header: 'Date',
          accessor: 'createdAt',
          className: 'px-3 py-3',
        },
        {
          Header: 'Time',
          accessor: 'createdAtTime',
          className: 'px-3 py-3',
        },
      ],
    },

    // {
    //   Header: 'Action',
    //   columns: [
    //     {
    //       Header: '',
    //       accessor: 'action',
    //       Cell: ({ row }) => (
    //         <ActionCell
    //           row={row}
    //           submitEdits={submitEdits} // Pass your update function here
    //           handleDelete={handleDelete} // Pass your handleDelete function here
    //         />
    //       ),
    //       className: 'px-3 py-3',
    //     },

    //   ],
    // },
  ];

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const lensCollectionId = localStorage.getItem("selectedLensCollectionId");
    setSelectedCollectionId(lensCollectionId);
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    if (userId) {
      setUserId(userId);
      getdata(userId);
      getCollectionData(userId,lensCollectionId);
    }
    else {
      navigate('/')
    }
  }, [userId]);

  const changeHandle = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value })
  }

  const validateForm = (patient = patient) => {
    const {
      PatientId,
      CollectionID,
      Lens_Status,
      Lens_Gender,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
    } = patient;

    let isError = false;
    let error = {};
    if (!PatientId) {
      error.PatientId = "Required !";
      toast.error('Please fill PatientId');
      isError = true;
    }
    else if (!selectedCollectionId) {
      toast.error('Please select Collection');
      error.RSphere = "Required !";
      isError = true;
    }
    else if (!RSphere && !LSphere) {
      toast.error('Please fill Sphere');
      error.RSphere = "Required !";
      isError = true;
    }
   
      else if (/[A-Za-z]/.test(RSphere) || /[A-Za-z]/.test(LSphere)) {
      toast.error('Sphere should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }
      else if (/[A-Za-z]/.test(RCylinder) || /[A-Za-z]/.test(LCylinder)) {
      toast.error('Cylinder should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }
    else if (/[A-Za-z]/.test(RAxis) || /[A-Za-z]/.test(LAxis)) {
      toast.error('Axis should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }
      else if (/[A-Za-z]/.test(LAdd) || /[A-Za-z]/.test(RAdd)) {
      toast.error('Add should not contain alphabets');
      error.RSphere = "Should not contain alphabets!";
      isError = true;
    }
    setValidation(error);
    return isError;
  };

  const handleSubmit = async (e, patient = patient) => {
    e.preventDefault();
    const {
      PatientId,
      CollectionID,
      Lens_Status,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
    } = patient;

    const matchPatientId = collectionListing.filter((x) => x.PatientId == PatientId)
    if (!validateForm(patient) ) {
      const data = {
        PatientId: PatientId,
        Lens_Status: Lens_Status || "0",
        RCylinder: RCylinder || "0",
        RAxis: RAxis || "0",
        RAdd: RAdd || "0",
        RSphere: RSphere || "0",
        LSphere: LSphere || "0",
        LCylinder: LCylinder || "0",
        LAxis: LAxis || "0",
        LAdd: LAdd || "0",
        CollectionId:selectedCollectionId|| null
      }
      if (matchPatientId[0]?.PatientId == patient.PatientId &&matchPatientId.length>0 ) {
        const res = await fetch(`${API_URL}/v1/patient?id=${matchPatientId[0].id}`, {
        // const res = await fetch(`${API_URL}/v1/patient`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        });
        if (res.ok) {
          const values = await res.json();
          getdata();
          childRef.current.resetNewRowData();
          navigate(`/search/${PatientId}`)
        }
        else {
          console.log('Post Failed')
        }
      } else {
        const res = await fetch(`${API_URL}/v1/patient?userId=${userId}`, {
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
          navigate(`/search/${PatientId}`)
        }
        else {
          console.log('Post Failed')
        }
      }


      setPatient({
        id: '',
        PatientId: '',
        // firstName: '',
        // lastName: '',
        // email: '',
        Box_id: '',
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
        // Lens_DTS: '',
        // LBIF: '',
        // RBIF: ''
      })

    }
  }

//   useEffect(() => {
//     getdata();
// }, [userId]);

  const getdata = async (userIds) => {
    const getResponse = await fetch(`${API_URL}/v1/patient?userId=${userIds}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      const patientData = data.Patient_Data.map(x => ({
        ...x,
        createdAt: moment(x.createdAt).format('YYYY-MM-DD'),
        createdAtTime: moment(x.createdAt).format('hh:mm:ss')
      }));
      setCollectionListing(patientData);
    } else {
      console.log('Get Failed');
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  }

  const getCollectionData = async (userIds,lensCollectionId) => {
    const getResponse = await fetch(
      `${API_URL}/v1/collection?userId=${userIds}`,
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
      const collName= collectionData.filter((x) =>x.id ==lensCollectionId );
      // setCollName(collName[0]?.Coll_name)
      setCollName(collName[0]?.Coll_name);
      setCollectionListing(collectionData);
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  };

  // const handleDelete = async (id) => {
  //   const data = {
  //     id: id
  //   };
  //   const response = await fetch(`${API_URL}/v1/patient`, {
  //     method: 'DELETE',
  //     body: JSON.stringify(data),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': JSON.parse(localStorage.getItem('token'))
  //     }

  //   });

  //   if (response.ok) {
  //     console.log('Deletion successful');
  //     getdata();
  //   } else {
  //     console.log('Deletion failed');
  //   }
  // }

  // function update(x) {
  //   console.log('update called', x);
  //   setTodoEditing(true);
  //   setPatient({
  //     Patient_id: x.id,
  //     firstName: x.firstName,
  //     lastName: x.lastName,
  //     email: x.email,

  //     Lens_id: x.Lens_id,
  //     Lens_Status: x.Lens_Status,
  //     Lens_Gender: x.Lens_Gender,
  //     Lens_Type: x.Lens_Type,
  //     RCylinder: x.RCylinder,
  //     RSphere: x.RSphere,
  //     RAxis: x.RAxis,
  //     RAdd: x.RAdd,
  //     LSphere: x.LSphere,
  //     LCylinder: x.LCylinder,
  //     LAxis: x.LAxis,
  //     LAdd: x.LAdd,
  //     Lens_DTS: x.Lens_DTS,
  //     LBIF: x.LBIF,
  //     RBIF: x.RBIF
  //   })
  // }


  // const submitEdits = async (patient) => {
  //   //e.preventDefault();
  //   const { id } = patient
  //   const data = {
  //     //PatientId: patient.PatientId,
  //     // firstName: patient.firstName,
  //     // lastName: patient.lastName,
  //     // email: patient.email,
  //     Lens_id: patient.Lens_id,
  //     Lens_Status: patient.Lens_Status,
  //     // Lens_Gender: patient.Lens_Gender,
  //     //Lens_Type: patient.Lens_Type,
  //     RCylinder: patient.RCylinder,
  //     RSphere: patient.RSphere,
  //     RAxis: patient.RAxis,
  //     RAdd: patient.RAdd,
  //     LSphere: patient.LSphere,
  //     LCylinder: patient.LCylinder,
  //     LAxis: patient.LAxis,
  //     LAdd: patient.LAdd,
  //     // Lens_DTS: patient.Lens_DTS,
  //     // LBIF: patient.LBIF,
  //     // RBIF: patient.RBIF
  //   }

  //   if (!validateForm(patient)) {
  //     const response = await fetch(`${API_URL}/v1/patient?id=${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(data),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': JSON.parse(localStorage.getItem('token'))
  //       },
  //     });

  //     if (response.ok) {
  //       console.log('Edit successful');
  //       getdata();
  //     } else {
  //       console.log('Edit failed');
  //     }
  //     setPatient({
  //       id: "",
  //       PatientId: "",
  //       // firstName: "",
  //       // lastName: "",
  //       // email: "",

  //       Box_id: '',
  //       Lens_Status: '',
  //       // Lens_Gender: '',
  //       // Lens_Type: '',
  //       RSphere: '',
  //       RCylinder: '',
  //       RAxis: '',
  //       RAdd: '',
  //       LSphere: '',
  //       LCylinder: '',
  //       LAxis: '',
  //       LAdd: '',
  //       // Lens_DTS: '',
  //       // LBIF: "",
  //       // RBIF: ""
  //     })
  //     setTodoEditing(false);
  //   }
  // }

  // Define a separate Cell component for the Action column
  //   const ActionCell = ({ row, submitEdits, handleDelete }) => (
  //     <div>
  //       <button className="btn btn-primary" onClick={() => submitEdits(row.original)}>
  //         <strong>
  //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  //   <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  //   <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
  // </svg>
  //         </strong>
  //       </button>
  //       <button className="btn btn-primary bg-danger" style={{ marginLeft: "10px" }} onClick={() => handleDelete(row.original.id)}>
  //         <strong>
  //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  //   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  //   <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  // </svg>
  //         </strong>
  //       </button>
  //       <button className="btn btn-primary bg-primary" style={{ marginLeft: "10px" }} onClick={() => navigate(`/search/${row.original.PatientId}`)}>
  //         <strong><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  //   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
  // </svg></strong>
  //       </button>
  //     </div>
  //   );

  // useEffect(() => {
  //   // Focus the input element when the component mounts
  //   patientInputRef.current.focus();
  // }, [collectionListing]);

  return (

    <>
      <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
      <div className='user_style patient_header'>
          <div className="row mt-0">
            <div className="col-12">
              <div className="table_card rounded patitnet_table overflow-hidden">
                <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit= 
                 {handleSubmit} API_URL={API_URL} selectedCollectionId={selectedCollectionId} userId={userId} roleData={role}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Patient