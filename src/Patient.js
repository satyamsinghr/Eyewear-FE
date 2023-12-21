// import React, { useState, useEffect, useRef } from 'react'
// import InlineEditingTable from './InlineEditingTable';
// import { useNavigate } from 'react-router';
// const patientInfo = {
//   id: '',
//   PatientId : '',
//   firstName: '',
//   lastName: '',
//   email: '',
//   Box_id: '',
//   Lens_Status: '',
//   Lens_Gender: '',
//   Lens_Type: '',
//   RSphere: '',
//   RCylinder: '',
//   RAxis: '',
//   RAdd: '',
//   LSphere: '',
//   LCylinder: '',
//   LAxis: '',
//   LAdd: '',
//   Lens_DTS: '',
//   LBIF: '',
//   RBIF: '',
// }

// const Patient = () => {
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(patientInfo);
//   const [validation, setValidation] = useState({});
//   const [collectionListing, setCollectionListing] = useState([]);
//   const [todoEditing, setTodoEditing] = useState(false);
//   const [userId, setUserId] = useState({});
//   const childRef = useRef();
//   const columns = [
//     {
//       Header: 'Patient Id',
//       accessor: 'PatientId',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'First Name',
//       accessor: 'firstName',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Last Name',
//       accessor: 'lastName',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Email',
//       accessor: 'email',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Lens Status',
//       accessor: 'Lens_Status',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Lens Gender',
//       accessor: 'Lens_Gender',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Lens Type',
//       accessor: 'Lens_Type',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'LAdd',
//       accessor: 'LAdd',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'LAxis',
//       accessor: 'LAxis',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'LCylinder',
//       accessor: 'LCylinder',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'LSphere',
//       accessor: 'LSphere',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Lens_DTS',
//       accessor: 'Lens_DTS',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'RAdd',
//       accessor: 'RAdd',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'RAxis',
//       accessor: 'RAxis',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'RCylinder',
//       accessor: 'RCylinder',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'RSphere',
//       accessor: 'RSphere',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'LBIF',
//       accessor: 'LBIF',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'RBIF',
//       accessor: 'RBIF',
//       className: 'px-3 py-3',
//     },
//     {
//       Header: 'Action',
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
//   ];




//   useEffect(() => {
//     const userId = JSON.parse(localStorage.getItem('userId'))
//     setUserId(userId)
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       getdata();
//     }
//   }, [userId]);

//   const changeHandle = (e) => {
//     setPatient({ ...patient, [e.target.name]: e.target.value })
//   }

//   const validateForm = (patient = patient) => {
//     const {
//       firstName,
//       lastName,
//       email,
//       Lens_Status,
//       Lens_Gender,
//       Lens_Type,
//       RSphere,
//       RCylinder,
//       RAxis,
//       RAdd,
//       LSphere,
//       LCylinder,
//       LAxis,
//       LAdd,
//       Lens_DTS,
//       LBIF,
//       RBIF
//     } = patient;

//     let isError = false;
//     let error = {};
//     if (!firstName) {
//       error.firstName = "Required !";
//     }
//     if (!lastName) {
//       error.lastName = "Required !";
//     }
//     if (!email) {
//       error.email = "Required !";
//     }
//     if (!Lens_Status) {
//       error.Lens_Status = "Required !";
//       isError = true;
//     }
//     if (!Lens_Gender) {
//       error.Lens_Gender = "Required !";
//       isError = true;
//     }
//     if (!Lens_Type) {
//       error.Lens_Type = "Required !";
//       isError = true;
//     }
//     if (!RSphere) {
//       error.RSphere = "Required !";
//       isError = true;
//     }
//     if (!RCylinder) {
//       error.RCylinder = "Required !";
//       isError = true;
//     }
//     if (!RAxis) {
//       error.RAxis = "Required !";
//       isError = true;
//     }
//     if (!RAdd) {
//       error.RAdd = "Required !";
//       isError = true;
//     }
//     if (!LSphere) {
//       error.LSphere = "Required !";
//       isError = true;
//     }
//     if (!LCylinder) {
//       error.LCylinder = "Required !";
//       isError = true;
//     }
//     if (!LAxis) {
//       error.LAxis = "Required !";
//       isError = true;
//     }
//     if (!LAdd) {
//       error.LAdd = "Required !";
//       isError = true;
//     }
//     if (!Lens_DTS) {
//       error.Lens_DTS = "Required !";
//       isError = true;
//     }
//     if (!LBIF) {
//       error.LBIF = "Required !";
//       isError = true;
//     }
//     if (!RBIF) {
//       error.RBIF = "Required !";
//       isError = true;
//     }
//     setValidation(error);
//     return isError;
//   };

//   const handleSubmit = async (e, patient = patient) => {
//     e.preventDefault();
//     const {
//       PatientId,
//       firstName,
//       lastName,
//       email,
//       Lens_Status,
//       Lens_Gender,
//       Lens_Type,
//       RSphere,
//       RCylinder,
//       RAxis,
//       RAdd,
//       LSphere,
//       LCylinder,
//       LAxis,
//       LAdd,
//       Lens_DTS,
//       LBIF,
//       RBIF
//     } = patient;
//     if (!validateForm(patient)) {
//       const data = {
//         PatientId : PatientId,
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         Lens_Status: Lens_Status,
//         Lens_Gender: Lens_Gender,
//         Lens_Type: Lens_Type,
//         RCylinder: RCylinder,
//         RAxis: RAxis,
//         RAdd: RAdd,
//         RSphere: RSphere,
//         LSphere: LSphere,
//         LCylinder: LCylinder,
//         LAxis: LAxis,
//         LAdd: LAdd,
//         Lens_DTS: Lens_DTS,
//         LBIF: LBIF,
//         RBIF: RBIF
//       }

//       const res = await fetch(`http://localhost:8080/api/v1/patient?userId=${userId}`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': JSON.parse(localStorage.getItem('token'))
//         }
//       });
//       if (res.ok) {
//         const values = await res.json();
//         getdata();
//         childRef.current.resetNewRowData();
//       }
//       else {
//         console.log('Post Failed')
//       }

//       setPatient({
//         id: '',
//         PatientId : '',
//         firstName: '',
//         lastName: '',
//         email: '',

//         Box_id: '',
//         Lens_Status: '',
//         Lens_Gender: '',
//         Lens_Type: '',
//         RSphere: '',
//         RCylinder: '',
//         RAxis: '',
//         RAdd: '',
//         LSphere: '',
//         LCylinder: '',
//         LAxis: '',
//         LAdd: '',
//         Lens_DTS: '',
//         LBIF: '',
//         RBIF: ''
//       })

//     }
//   }

//   const getdata = async () => {
//     const getResponse = await fetch(`http://localhost:8080/api/v1/patient?userId=${userId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization': JSON.parse(localStorage.getItem('token'))
//       }

//     });
//     if (getResponse.ok) {
//       const data = await getResponse.json();
//       setCollectionListing(data.Patient_Data);
//     } else {
//       console.log('Get Failed');
//     }
//   }

//   const handleDelete = async (id) => {
//     const data = {
//       id : id
//     };
//     const response = await fetch(`http://localhost:8080/api/v1/patient`, {
//       method: 'DELETE',
//       body: JSON.stringify(data),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': JSON.parse(localStorage.getItem('token'))
//       }

//     });

//     if (response.ok) {
//       console.log('Deletion successful');
//       getdata();
//     } else {
//       console.log('Deletion failed');
//     }
//   }

//   // function update(x) {
//   //   console.log('update called', x);
//   //   setTodoEditing(true);
//   //   setPatient({
//   //     Patient_id: x.id,
//   //     firstName: x.firstName,
//   //     lastName: x.lastName,
//   //     email: x.email,

//   //     Lens_id: x.Lens_id,
//   //     Lens_Status: x.Lens_Status,
//   //     Lens_Gender: x.Lens_Gender,
//   //     Lens_Type: x.Lens_Type,
//   //     RCylinder: x.RCylinder,
//   //     RSphere: x.RSphere,
//   //     RAxis: x.RAxis,
//   //     RAdd: x.RAdd,
//   //     LSphere: x.LSphere,
//   //     LCylinder: x.LCylinder,
//   //     LAxis: x.LAxis,
//   //     LAdd: x.LAdd,
//   //     Lens_DTS: x.Lens_DTS,
//   //     LBIF: x.LBIF,
//   //     RBIF: x.RBIF
//   //   })
//   // }


//   const submitEdits = async (patient) => {
//     debugger
//     //e.preventDefault();
//     const { id } = patient
//     const data = {
//       //PatientId: patient.PatientId,
//       firstName: patient.firstName,
//       lastName: patient.lastName,
//       email: patient.email,
//       Lens_id: patient.Lens_id,
//       Lens_Status: patient.Lens_Status,
//       Lens_Gender: patient.Lens_Gender,
//       Lens_Type: patient.Lens_Type,
//       RCylinder: patient.RCylinder,
//       RSphere: patient.RSphere,
//       RAxis: patient.RAxis,
//       RAdd: patient.RAdd,
//       LSphere: patient.LSphere,
//       LCylinder: patient.LCylinder,
//       LAxis: patient.LAxis,
//       LAdd: patient.LAdd,
//       Lens_DTS: patient.Lens_DTS,
//       LBIF: patient.LBIF,
//       RBIF: patient.RBIF
//     }

//     if (!validateForm(patient)) {
//       const response = await fetch(`http://localhost:8080/api/v1/patient?id=${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(data),
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': JSON.parse(localStorage.getItem('token'))
//         },
//       });

//       if (response.ok) {
//         console.log('Edit successful');
//         getdata();
//       } else {
//         console.log('Edit failed');
//       }
//       setPatient({
//         id: "",
//         PatientId : "",
//         firstName: "",
//         lastName: "",
//         email: "",

//         Box_id: '',
//         Lens_Status: '',
//         Lens_Gender: '',
//         Lens_Type: '',
//         RSphere: '',
//         RCylinder: '',
//         RAxis: '',
//         RAdd: '',
//         LSphere: '',
//         LCylinder: '',
//         LAxis: '',
//         LAdd: '',
//         Lens_DTS: '',
//         LBIF: "",
//         RBIF: ""
//       })
//       setTodoEditing(false);
//     }
//   }

//   // Define a separate Cell component for the Action column
//   const ActionCell = ({ row, submitEdits, handleDelete }) => (
//     <td>
//       <div>
//         <button className="btn btn-primary me-3" onClick={() => submitEdits(row.original)}>
//           <strong>Edit</strong>
//         </button>
//         <button className="btn btn-primary bg-danger" onClick={() => handleDelete(row.original.id)}>
//           <strong>Delete</strong>
//         </button>
//         <button className="btn btn-primary bg-primary" style={{marginLeft:"10px"}} onClick={() => navigate(`/analysis/${row.original.PatientId}`)}>
//           <strong>Analyse</strong>
//         </button>
//       </div>
//     </td>
//   );

//   return (

//     <>
//       <div className="col p-5" style={{ marginRight: 34 }}>
//         <div className='user_style'>
//           <div className="user_name">
//             <h2>Reports</h2>
//             <hr className="mt-4" />
//           </div>
//           <div className="row">
//             <div className="col-12 mb-3 mt-3">
//               <label className="form_title">
//                 Sort Data as your requirement
//               </label>
//             </div>
//           </div>
//           {/* <div className="row search_input">
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="First Name"
//                   name='firstName'
//                   value={patient.firstName}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">First Name</label>
//                 <span className="text-danger">{validation.firstName}</span>
//               </div>
//             </div>
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="Last Name"
//                   name='lastName'
//                   value={patient.lastName}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Last Name</label>
//                 <span className="text-danger">{validation.lastName}</span>
//               </div>
//             </div>
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="email"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="name@example.com"
//                   name='email'
//                   value={patient.email}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Email</label>
//                 <span className="text-danger">{validation.email}</span>
//               </div>
//             </div>

//           </div>
//           <div className="row search_input">
//             <div className='col'>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="L Status"
//                   name='Lens_Status'
//                   value={patient.Lens_Status}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Lens Status</label>
//                 <span className="text-danger">{validation.Lens_Status}</span>
//               </div>
//             </div>

//             <div className='col'>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder=" Lens Gender"
//                   name='Lens_Gender'
//                   value={patient.Lens_Gender}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Lens Gender</label>
//                 <span className="text-danger">{validation.Lens_Gender}</span>
//               </div>
//             </div>

//             <div className='col'>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="Lens Type"
//                   name='Lens_Type'
//                   value={patient.Lens_Type}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Lens Type</label>
//                 <span className="text-danger">{validation.Lens_Type}</span>
//               </div>
//             </div>
//           </div>

//           <div className="row search_input">
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="R Sphere"
//                   name='RSphere'
//                   value={patient.RSphere}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">R Sphere</label>
//                 <span className="text-danger">{validation.RSphere}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="R Axis"
//                   name='RAxis'
//                   value={patient.RAxis}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">R Axis</label>
//                 <span className="text-danger">{validation.RAxis}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="L Sphere"
//                   name='LSphere'
//                   value={patient.LSphere}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">L Sphere</label>
//                 <span className="text-danger">{validation.LSphere}</span>
//               </div>
//             </div>
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="L Axis"
//                   name='LAxis'
//                   value={patient.LAxis}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">L Axis</label>
//                 <span className="text-danger">{validation.LAxis}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="Lens dts"
//                   name='Lens_DTS'
//                   value={patient.Lens_DTS}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">Lens dts</label>
//                 <span className="text-danger">{validation.Lens_DTS}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="R Cylinder"
//                   name='RCylinder'
//                   value={patient.RCylinder}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">R Cylinder</label>
//                 <span className="text-danger">{validation.RCylinder}</span>
//               </div>
//             </div>
//             <div className="col">
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="R Add"
//                   name='RAdd'
//                   value={patient.RAdd}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">R Add</label>
//                 <span className="text-danger">{validation.RAdd}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="L Cylinder"
//                   name='LCylinder'
//                   value={patient.LCylinder}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">L Cylinder</label>
//                 <span className="text-danger">{validation.LCylinder}</span>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="floatingInput"
//                   placeholder="L Add"
//                   name='LAdd'
//                   value={patient.LAdd}
//                   onChange={changeHandle}
//                 />
//                 <label htmlFor="floatingInput">L Add</label>
//                 <span className="text-danger">{validation.LAdd}</span>
//               </div>
//             </div>

//             <div className='row search_input'>
//               <div className='col'>
//                 <div className="form-floating mb-3">
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="floatingInput"
//                     placeholder="L BIF"
//                     name='LBIF'
//                     value={patient.LBIF}
//                     onChange={changeHandle}
//                   />
//                   <label htmlFor="floatingInput">L BIF</label>
//                   <span className="text-danger">{validation.LBIF}</span>
//                 </div>
//                 <div className="form-floating mb-3">
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="floatingInput"
//                     placeholder="R BIF"
//                     name='RBIF'
//                     value={patient.RBIF}
//                     onChange={changeHandle}
//                   />
//                   <label htmlFor="floatingInput">R BIF</label>
//                   <span className="text-danger">{validation.RBIF}</span>
//                 </div>
//               </div>
//             </div>


//           </div>
//           <div className='row d-flex justify-content-end'>
//             <div className="col-lg-2">
//               <div className="form-floating mb-3 ">
//                 <button className="btn btn-primary w-100" onClick={todoEditing === true ? submitEdits : handleSubmit}>{!todoEditing ? <span>Submit</span> : <span>Update</span>}</button>
//               </div>
//             </div>
//           </div> */}
//           <div className="row mt-4">
//             <div className="col-12">
//               <div className="table_card bg-white rounded">
//                 {/* <table className="table w-full m-0">
//                   <thead className="rounded">
//                     <tr>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         First Name
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Last Name
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Email
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Lens Status
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Lens Gender
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Lens Type
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         LAdd
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         LAxis
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         LCylinder
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         LSphere
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Lens_DTS
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         RAdd
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         RAxis
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         RCylinder
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         RSphere
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         LBIF
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         RBIF
//                       </th>
//                       <th
//                         className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {collectionListing.map((x, id) => (
//                       <>
//                         <tr key={x.id} className="data">
//                           <td className='px-3 py-3'>{x.firstName}</td>
//                           <td className='px-3 py-3'>{x.lastName}</td>
//                           <td className='px-3 py-3'>{x.email}</td>
//                           <td className='px-3 py-3'>{x.Lens_Status}</td>
//                           <td className='px-3 py-3'>{x.Lens_Gender}</td>
//                           <td className='px-3 py-3'>{x.Lens_Type}</td>
//                           <td className='px-3 py-3'>{x.LAdd}</td>
//                           <td className='px-3 py-3'>{x.LAxis}</td>
//                           <td className='px-3 py-3'>{x.LCylinder}</td>
//                           <td className='px-3 py-3'>{x.LSphere}</td>
//                           <td className='px-3 py-3'>{x.Lens_DTS}</td>
//                           <td className='px-3 py-3'>{x.RAdd}</td>
//                           <td className='px-3 py-3'>{x.RAxis}</td>
//                           <td className='px-3 py-3'>{x.RCylinder}</td>
//                           <td className='px-3 py-3'>{x.RSphere}</td>
//                           <td className='px-3 py-3'>{x.LBIF}</td>
//                           <td className='px-3 py-3'>{x.RBIF}</td>
//                           <td className="todo-actions px-3 py-3" style={{ display: "inline-flex" }}>
//                             <button className="btn btn-primary me-3" onClick={() => update(x)}><strong>Edit</strong></button>
//                             <button className="btn btn-primary bg-danger" onClick={() => handleDelete(x.id)}><strong>Delete</strong></button>
//                           </td>
//                         </tr >
//                       </>
//                     ))}
//                   </tbody>
//                 </table> */}

//                 <InlineEditingTable ref={childRef} columns={columns} data={collectionListing} handleSubmit={handleSubmit} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Patient






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
    const userId = JSON.parse(localStorage.getItem('userId'))
    setUserId(userId)
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
    debugger
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
      <button className="btn btn-primary bg-primary" style={{ marginLeft: "10px" }} onClick={() => navigate(`/analysis/${row.original.PatientId}`)}>
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
          {/* <div className="row">
            <div className="col-12 mb-3 mt-3">
              <label className="form_title">
                Sort Data as your requirement
              </label>
            </div>
          </div> */}
          {/* <div className="row search_input">
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="First Name"
                  name='firstName'
                  value={patient.firstName}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">First Name</label>
                <span className="text-danger">{validation.firstName}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Last Name"
                  name='lastName'
                  value={patient.lastName}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">Last Name</label>
                <span className="text-danger">{validation.lastName}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  name='email'
                  value={patient.email}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">Email</label>
                <span className="text-danger">{validation.email}</span>
              </div>
            </div>

          </div>
          <div className="row search_input">
            <div className='col'>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Status"
                  name='Lens_Status'
                  value={patient.Lens_Status}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">Lens Status</label>
                <span className="text-danger">{validation.Lens_Status}</span>
              </div>
            </div>

            <div className='col'>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder=" Lens Gender"
                  name='Lens_Gender'
                  value={patient.Lens_Gender}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">Lens Gender</label>
                <span className="text-danger">{validation.Lens_Gender}</span>
              </div>
            </div>

            <div className='col'>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Lens Type"
                  name='Lens_Type'
                  value={patient.Lens_Type}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">Lens Type</label>
                <span className="text-danger">{validation.Lens_Type}</span>
              </div>
            </div>
          </div>

          <div className="row search_input">
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Sphere"
                  name='RSphere'
                  value={patient.RSphere}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">R Sphere</label>
                <span className="text-danger">{validation.RSphere}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Axis"
                  name='RAxis'
                  value={patient.RAxis}
                  onChange={changeHandle}
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
                  value={patient.LSphere}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">L Sphere</label>
                <span className="text-danger">{validation.LSphere}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Axis"
                  name='LAxis'
                  value={patient.LAxis}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">L Axis</label>
                <span className="text-danger">{validation.LAxis}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Lens dts"
                  name='Lens_DTS'
                  value={patient.Lens_DTS}
                  onChange={changeHandle}
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
                  value={patient.RCylinder}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">R Cylinder</label>
                <span className="text-danger">{validation.RCylinder}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="R Add"
                  name='RAdd'
                  value={patient.RAdd}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">R Add</label>
                <span className="text-danger">{validation.RAdd}</span>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="L Cylinder"
                  name='LCylinder'
                  value={patient.LCylinder}
                  onChange={changeHandle}
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
                  value={patient.LAdd}
                  onChange={changeHandle}
                />
                <label htmlFor="floatingInput">L Add</label>
                <span className="text-danger">{validation.LAdd}</span>
              </div>
            </div>

            <div className='row search_input'>
              <div className='col'>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="L BIF"
                    name='LBIF'
                    value={patient.LBIF}
                    onChange={changeHandle}
                  />
                  <label htmlFor="floatingInput">L BIF</label>
                  <span className="text-danger">{validation.LBIF}</span>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="R BIF"
                    name='RBIF'
                    value={patient.RBIF}
                    onChange={changeHandle}
                  />
                  <label htmlFor="floatingInput">R BIF</label>
                  <span className="text-danger">{validation.RBIF}</span>
                </div>
              </div>
            </div>


          </div>
          <div className='row d-flex justify-content-end'>
            <div className="col-lg-2">
              <div className="form-floating mb-3 ">
                <button className="btn btn-primary w-100" onClick={todoEditing === true ? submitEdits : handleSubmit}>{!todoEditing ? <span>Submit</span> : <span>Update</span>}</button>
              </div>
            </div>
          </div> */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card rounded overflow-hidden">
                {/* <table className="table w-full m-0">
                  <thead className="rounded">
                    <tr>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        First Name
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Last Name
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Email
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Lens Status
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Lens Gender
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Lens Type
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        LAdd
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        LAxis
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        LCylinder
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        LSphere
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Lens_DTS
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        RAdd
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        RAxis
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        RCylinder
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        RSphere
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        LBIF
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        RBIF
                      </th>
                      <th
                        className="py-3 px-2 font- text-basecolor-900 text-lg font-semibold text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectionListing.map((x, id) => (
                      <>
                        <tr key={x.id} className="data">
                          <td className='px-3 py-3'>{x.firstName}</td>
                          <td className='px-3 py-3'>{x.lastName}</td>
                          <td className='px-3 py-3'>{x.email}</td>
                          <td className='px-3 py-3'>{x.Lens_Status}</td>
                          <td className='px-3 py-3'>{x.Lens_Gender}</td>
                          <td className='px-3 py-3'>{x.Lens_Type}</td>
                          <td className='px-3 py-3'>{x.LAdd}</td>
                          <td className='px-3 py-3'>{x.LAxis}</td>
                          <td className='px-3 py-3'>{x.LCylinder}</td>
                          <td className='px-3 py-3'>{x.LSphere}</td>
                          <td className='px-3 py-3'>{x.Lens_DTS}</td>
                          <td className='px-3 py-3'>{x.RAdd}</td>
                          <td className='px-3 py-3'>{x.RAxis}</td>
                          <td className='px-3 py-3'>{x.RCylinder}</td>
                          <td className='px-3 py-3'>{x.RSphere}</td>
                          <td className='px-3 py-3'>{x.LBIF}</td>
                          <td className='px-3 py-3'>{x.RBIF}</td>
                          <td className="todo-actions px-3 py-3" style={{ display: "inline-flex" }}>
                            <button className="btn btn-primary me-3" onClick={() => update(x)}><strong>Edit</strong></button>
                            <button className="btn btn-primary bg-danger" onClick={() => handleDelete(x.id)}><strong>Delete</strong></button>
                          </td>
                        </tr >
                      </>
                    ))}
                  </tbody>
                </table> */}

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