import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './signup.css'
import Img1 from '../images/hopefulWaysLogo.JPG'


const Signup = () => {
    const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '', password: '' })
    const [validation, setValidation] = useState({});


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        const { email, firstName, lastName, password } = formData;
        let error = {};
        let isError = false;
        if (!email) {
            error.email = "*Email is required";
            isError = true;
        }
        if (!firstName) {
            error.firstName = "*First Name is required";
            isError = true;
        }
        if (!lastName) {
            error.lastName = "*Last Name is required";
            isError = true;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            error.email = "*Invalid email address";
            isError = true;
        }
        if (password.length <= 7) {
            error.password = '*Please enter minimun 8 digit';
            isError = true;
        }
        if (!password) {
            error.password = "*Password is required";
            isError = true;
        }
        setValidation(error);
        return isError;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) {
            const res = await fetch("http://localhost:8080/api/v1/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const dataValues = await res.json();
            if (res.status === 400 || !dataValues) {
                window.alert("Email is already Registered!")
                console.log("Invalid Registration")
            }
            else {
                window.alert("Registration Successful")
                console.log("Registration Successful")

                navigate("/")
            }
        }
    }
    return (
        <>
            <section className="login vh-100 d-flex align-items-center">
                <div className="container m-auto">
                    <div className="row">
                        <div className="col-lg-7 col-md-8 col-sm-12 col-12 m-auto">
                            <div className="bg-white login_card">
                                <div className="w-100 row m-0">
                                    <div className="col-lg-7 p-0 col-md-12 col-sm-12 col-12 m-auto">
                                        <img src={Img1} width="100px" alt="" />
                                        <h4 className="m-0">Create Account</h4>
                                        <form action="method" className="mt-4 pt-2 login_form" onSubmit={handleSubmit}>
                                            <div className="position-relative">
                                                <input type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">
                                                </div>
                                                <span className="text-danger">{validation.email}</span>
                                            </div>
                                            <div className="position-relative mt-3 pt-1">
                                                <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">
                                                </div>
                                                <span className="text-danger">{validation.firstName}</span>
                                            </div>
                                            <div className="position-relative mt-3 pt-1">
                                                <input type="text" placeholder="Last Name" name='lastName' value={formData.lastName} onChange={handleChange} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">
                                                </div>
                                                <span className="text-danger">{validation.lastName}</span>
                                            </div>
                                            <div className="position-relative mt-3 pt-1">
                                                <input type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">

                                                </div>
                                                <span className="text-danger">{validation.password}</span>
                                                <div
                                                    className="position-absolute top-0 bottom-0 end-0 me-3 d-flex align-items-center">

                                                </div>
                                            </div>
                                            <div className="mt-4 pt-2">
                                                <button type='submit' className="btn btn-primary w-100">
                                                    Register
                                                </button>
                                            </div>
                                        </form>
                                        <div className="mt-4 pt-3">
                                            <p className="register_now">Already have an account ?
                                                <Link to="/">Login</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Signup