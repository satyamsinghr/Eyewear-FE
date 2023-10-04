import React, { useState, useEffect } from 'react'

const patientInfo = {
  Patient_id: '',
  firstName: '',
  lastName: '',
  email: '',
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
  Lens_DTS: ''
}

const Patient = () => {
  const [patient, setPatient] = useState(patientInfo);
  const [validation, setValidation] = useState({});
  const [collectionListing, setCollectionListing] = useState([]);
  const [todoEditing, setTodoEditing] = useState(false);
  const [userId, setUserId] = useState({});

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

  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
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
      Lens_DTS
    } = patient;

    let isError = false;
    let error = {};
    if (!firstName) {
      error.firstName = "Required !";
    }
    if (!lastName) {
      error.lastName = "Required !";
    }
    if (!email) {
      error.email = "Required !";
    }
    if (!Lens_Status) {
      error.Lens_Status = "Required !";
      isError = true;
    }
    if (!Lens_Gender) {
      error.Lens_Gender = "Required !";
      isError = true;
    }
    if (!Lens_Type) {
      error.Lens_Type = "Required !";
      isError = true;
    }
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
    if (!Lens_DTS) {
      error.Lens_DTS = "Required !";
      isError = true;
    }
    setValidation(error);
    return isError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
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
      Lens_DTS
    } = patient;
    if (!validateForm()) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
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
        Lens_DTS: Lens_DTS
      }

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
      }
      else {
        console.log('Post Failed')
      }

      setPatient({
        Patient_id: '',
        firstName: '',
        lastName: '',
        email: '',

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
        Lens_DTS: '',
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
      setCollectionListing(data.Patient_Data);
    } else {
      console.log('Get Failed');
    }
  }

  const handleDelete = async (id) => {
    const data = {
      Patient_id: id
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

  function update(x) {
    setTodoEditing(true);
    setPatient({
      Patient_id: x.id,
      firstName: x.firstName,
      lastName: x.lastName,
      email: x.email,

      Lens_id: x.Lens_id,
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
    })
  }


  const submitEdits = async (e) => {
    e.preventDefault();
    const { Patient_id } = patient
    const data = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      Lens_id: patient.Lens_id,
      Lens_Status: patient.Lens_Status,
      Lens_Gender: patient.Lens_Gender,
      Lens_Type: patient.Lens_Type,
      RCylinder: patient.RCylinder,
      RSphere: patient.RSphere,
      RAxis: patient.RAxis,
      RAdd: patient.RAdd,
      LSphere: patient.LSphere,
      LCylinder: patient.LCylinder,
      LAxis: patient.LAxis,
      LAdd: patient.LAdd,
      Lens_DTS: patient.Lens_DTS,
    }

    if (!validateForm()) {
      const response = await fetch(`http://localhost:8080/api/v1/patient?id=${Patient_id}`, {
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
        Patient_id: "",
        firstName: "",
        lastName: "",
        email: "",

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
        Lens_DTS: '',
      })
      setTodoEditing(false);
    }
  }
  return (

    <>
      <div className="col p-5" style={{ marginRight: 34 }}>
        <div className='user_style'>
          <div className="user_name">
            <h2>Reports</h2>
            <hr className="mt-4" />
          </div>
          <div className="row">
            <div className="col-12 mb-3 mt-3">
              <label className="form_title">
                Sort Data as your requirement
              </label>
            </div>
          </div>
          <div className="row search_input">
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

          </div>
          <div className='row d-flex justify-content-end'>
            <div className="col-lg-2">
              <div className="form-floating mb-3 ">
                <button className="btn btn-primary w-100" onClick={todoEditing === true ? submitEdits : handleSubmit}>{!todoEditing ? <span>Submit</span> : <span>Update</span>}</button>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <div className="table_card bg-white rounded">
                <table className="table w-full m-0">
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
                          <td className="todo-actions px-3 py-3" style={{ display: "inline-flex" }}>
                            <button className="btn btn-primary me-3" onClick={() => update(x)}><strong>Edit</strong></button>
                            <button className="btn btn-primary bg-danger" onClick={() => handleDelete(x.id)}><strong>Delete</strong></button>
                          </td>
                        </tr >
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Patient