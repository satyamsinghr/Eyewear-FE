import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './signup.css'


const Login = () => {
    const [data, setData] = useState({ email: '', password: '' })
    const [loginError, setLoginError] = useState("")

    const [validation, setValidation] = useState({});

    const changingValues = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        const { email, password } = data;
        let error = {};
        let isError = false;
        if (!email) {
            error.email = "Email is required";
            isError = true;
        }
        if (!password) {
            error.password = "Password is required";
            isError = true;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            error.email = 'Invalid email address';
            isError = true;
        }
        if (password.length <= 7) {
            error.password = '*Please enter minimun 8 digit';
            isError = true;
        }
        setValidation(error);
        return isError;
    }

    const navigate = useNavigate();

    const submitHandle = async (e) => {
        e.preventDefault();
        const { email, password } = data;
        if (!validateForm()) {
            const response = await fetch('http://localhost:8080/api/v1/signIn', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const { token, firstName, userId } = await response.json();

                localStorage.setItem('token', JSON.stringify(token));
                localStorage.setItem('firstName', JSON.stringify(firstName));
                localStorage.setItem('userId', JSON.stringify(userId));

                alert('Login successful');
                navigate('/collection')
            } else {
                setLoginError("Invalid Credentials")
                alert('Please enter valid Credentials');
            };
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
                                        <h4 className="m-0">Login</h4>
                                        <h6 className="mt-1">Welcome
                                            back!</h6>
                                        <form action="method" className="mt-4 pt-2 login_form" onSubmit={submitHandle}>
                                            <div className="position-relative">
                                                <input type="email" placeholder="Email" name='email' value={data.email} onChange={changingValues} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">


                                                </div>
                                                <span className="text-danger">{validation.email}</span>
                                            </div>
                                            <div className="position-relative mt-3 pt-1">
                                                <input type="password" placeholder="Password" name='password' value={data.password} onChange={changingValues} />
                                                <div
                                                    className="position-absolute top-0 bottom-0 start-0 ms-3 d-flex align-items-center">


                                                </div>
                                                <span className="text-danger">{validation.password}</span>
                                                <div
                                                    className="position-absolute top-0 bottom-0 end-0 me-3 d-flex align-items-center">

                                                </div>
                                            </div>
                                            <div className="mt-3 text-end">
                                                <a href="#" className="font- text-basecolor-900 font-medium text-base">Forgot
                                                    Password ?</a>
                                            </div>
                                            <div className="mt-4 pt-2">
                                                <button className="btn btn-primary w-100">
                                                    Login
                                                </button>
                                            </div>
                                            <div className="my-4 py-2 text-center">
                                                <h5 className="m-0">Or continue with
                                                </h5>
                                            </div>
                                            <div>
                                                <button className="google_btn">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M5.31891 14.5034L4.4835 17.6221L1.43011 17.6867C0.517594 15.9942 0 14.0577 0 11.9999C0 10.01 0.483938 8.1335 1.34175 6.4812H1.34241L4.06078 6.97958L5.25159 9.68164C5.00236 10.4082 4.86652 11.1882 4.86652 11.9999C4.86661 12.8808 5.02617 13.7247 5.31891 14.5034Z"
                                                            fill="#FBBB00" />
                                                        <path
                                                            d="M23.7902 9.7583C23.928 10.4842 23.9999 11.2339 23.9999 12.0001C23.9999 12.8592 23.9095 13.6972 23.7375 14.5056C23.1533 17.2563 21.6269 19.6583 19.5124 21.3581L19.5118 21.3574L16.0878 21.1827L15.6032 18.1576C17.0063 17.3348 18.1028 16.0471 18.6804 14.5056H12.2637V9.7583H23.7902Z"
                                                            fill="#518EF8" />
                                                        <path
                                                            d="M19.5114 21.3575L19.5121 21.3581C17.4556 23.0111 14.8433 24.0001 11.9996 24.0001C7.42969 24.0001 3.45652 21.4458 1.42969 17.6869L5.31849 14.5037C6.33188 17.2083 8.94089 19.1336 11.9996 19.1336C13.3143 19.1336 14.546 18.7781 15.6029 18.1577L19.5114 21.3575Z"
                                                            fill="#28B446" />
                                                        <path
                                                            d="M19.6596 2.76263L15.7721 5.94525C14.6783 5.26153 13.3853 4.86656 12 4.86656C8.87213 4.86656 6.21431 6.88017 5.25169 9.68175L1.34245 6.48131H1.3418C3.33895 2.63077 7.36224 0 12 0C14.9117 0 17.5814 1.03716 19.6596 2.76263Z"
                                                            fill="#F14336" />
                                                    </svg>

                                                    <span className="ms-2 d-inline-block">Continue with Google</span>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="mt-4 pt-3">
                                            <p className="register_now">Don’t have an
                                                account ?
                                                <Link to="/signUp">Register</Link>
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

export default Login