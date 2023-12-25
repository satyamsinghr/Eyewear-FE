import React, { useState, useEffect, useRef } from 'react'
import InlineEditingTable from './InlineEditingTable';
import { useNavigate } from 'react-router';
import moment from 'moment';
const patientInfo = {
  id: '',
  PatientId: '',
  // Percentage: '',
  // firstName: '',
  // lastName: '',
  // email: '',
  Box_id: '',
  Lens_Status: '',
  Lens_Gender: '',
  // Lens_Type: '',
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
  // RBIF: '',
}

const Patient = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(patientInfo);
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState({});
  const childRef = useRef();


  const columns = [
    {
      Header: 'EyeWare',
      columns: [
        {
          Header: 'Patient Id',
          accessor: 'PatientId',
          className: 'px-3 py-3',
        },
        // {
        //   Header: '%',
        //   accessor: 'Percentage',
        //   className: 'px-3 py-3',
        // },
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

    {
      Header: 'Action',
      columns: [
        {
          Header: '',
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

      ],
    },
  ];


  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId) {
      setUserId(userId);
    }
    else{
        navigate('/')
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
    }
  }, [userId]);

  const changeHandle = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value })
  }

  const validateForm = (patient = patient) => {
    const {
      // firstName,
      // lastName,
      // email,
      Lens_Status,
      Lens_Gender,
      // Lens_Type,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
      // Lens_DTS,
      // LBIF,
      // RBIF
    } = patient;

    let isError = false;
    let error = {};
    // if (!firstName) {
    //   error.firstName = "Required !";
    // }
    // if (!lastName) {
    //   error.lastName = "Required !";
    // }
    // if (!email) {
    //   error.email = "Required !";
    // }

    if (!Lens_Status) {
      error.Lens_Status = "Required !";
      isError = true;
    }

    // if (!Lens_Gender) {
    //   error.Lens_Gender = "Required !";
    //   isError = true;
    // }

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

    if (!Lens_Status) {
      error.Lens_Status = "Required !";
      isError = true;
    }

    // if (!Lens_DTS) {
    //   error.Lens_DTS = "Required !";
    //   isError = true;
    // }
    // if (!LBIF) {
    //   error.LBIF = "Required !";
    //   isError = true;
    // }
    // if (!RBIF) {
    //   error.RBIF = "Required !";
    //   isError = true;
    // }

    setValidation(error);
    return isError;
  };

  const handleSubmit = async (e, patient = patient) => {
    e.preventDefault();
    console.log('patient', patient)
    const {
      PatientId,
      // Percentage,
      // firstName,
      // lastName,
      // email,
      Lens_Status,
      // Lens_Gender,
      //Lens_Type,
      RSphere,
      RCylinder,
      RAxis,
      RAdd,
      LSphere,
      LCylinder,
      LAxis,
      LAdd,
      // Lens_DTS,
      // LBIF,
      // RBIF
    } = patient;

    if (!validateForm(patient)) {
      const data = {
        PatientId: PatientId,
        // Percentage: Percentage,
        // firstName: firstName,
        // lastName: lastName,
        // email: email,
        Lens_Status: Lens_Status,
        // Lens_Gender: Lens_Gender,
        // Lens_Type: Lens_Type,
        RCylinder: RCylinder,
        RAxis: RAxis,
        RAdd: RAdd,
        RSphere: RSphere,
        LSphere: LSphere,
        LCylinder: LCylinder,
        LAxis: LAxis,
        LAdd: LAdd,
        // Lens_DTS: Lens_DTS,
        // LBIF: LBIF,
        // RBIF: RBIF
      }

      console.log('data>>>>>>>', data);

      const res = await fetch(`http://localhost:8080/api/v1/patient?userId=${userId}`, {
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

  const getdata = async () => {
    const getResponse = await fetch(`http://localhost:8080/api/v1/patient?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': JSON.parse(localStorage.getItem('token'))
      }

    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('data.Patient_Data', data.Patient_Data);

      const patientData = data.Patient_Data.map(x => ({
        ...x,
        createdAt : moment(x.createdAt).format('YYYY-MM-DD'),
        createdAtTime : moment(x.createdAt).format('hh:mm:ss')
      }));

      setCollectionListing(patientData);
    } else {
      console.log('Get Failed');
    }
  }

  const handleDelete = async (id) => {
    const data = {
      id: id
    };
    const response = await fetch(`http://localhost:8080/api/v1/patient`, {
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


  const submitEdits = async (patient) => {
    //e.preventDefault();
    const { id } = patient
    const data = {
      //PatientId: patient.PatientId,
      // firstName: patient.firstName,
      // lastName: patient.lastName,
      // email: patient.email,
      Lens_id: patient.Lens_id,
      Lens_Status: patient.Lens_Status,
      // Lens_Gender: patient.Lens_Gender,
      //Lens_Type: patient.Lens_Type,
      RCylinder: patient.RCylinder,
      RSphere: patient.RSphere,
      RAxis: patient.RAxis,
      RAdd: patient.RAdd,
      LSphere: patient.LSphere,
      LCylinder: patient.LCylinder,
      LAxis: patient.LAxis,
      LAdd: patient.LAdd,
      // Lens_DTS: patient.Lens_DTS,
      // LBIF: patient.LBIF,
      // RBIF: patient.RBIF
    }

    if (!validateForm(patient)) {
      const response = await fetch(`http://localhost:8080/api/v1/patient?id=${id}`, {
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
      setPatient({
        id: "",
        PatientId: "",
        // firstName: "",
        // lastName: "",
        // email: "",

        Box_id: '',
        Lens_Status: '',
        // Lens_Gender: '',
        // Lens_Type: '',
        RSphere: '',
        RCylinder: '',
        RAxis: '',
        RAdd: '',
        LSphere: '',
        LCylinder: '',
        LAxis: '',
        LAdd: '',
        // Lens_DTS: '',
        // LBIF: "",
        // RBIF: ""
      })
      setTodoEditing(false);
    }
  }

  // Define a separate Cell component for the Action column
  const ActionCell = ({ row, submitEdits, handleDelete }) => (
    <div>
      <button className="btn btn-primary" onClick={() => submitEdits(row.original)}>
        <strong>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>
        </strong>
      </button>
      <button className="btn btn-primary bg-danger" style={{ marginLeft: "10px" }} onClick={() => handleDelete(row.original.id)}>
        <strong>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
        </strong>
      </button>
      <button className="btn btn-primary bg-primary" style={{ marginLeft: "10px" }} onClick={() => navigate(`/search/${row.original.PatientId}`)}>
        <strong><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></strong>
      </button>
    </div>
  );

  return (

    <>
      <div className="col p-5" style={{ marginRight: 34 }}>
        <div className='user_style'>
          <div className="user_name">
            <h2>Patients</h2>
            <hr className="mt-4" />
          </div>
        
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card rounded overflow-hidden">
                

                <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Patient