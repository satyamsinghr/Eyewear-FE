import React from 'react'
import { Routes, Route,useLocation } from 'react-router-dom'
import Signup from './Registration/Signup'
import Login from './Registration/Login'
import FileCollection from './FileCollection'
import Patient from './Patient'
import Lenses from './Lenses'
import Boxvalue from './Boxvalue'
import Sidebar from './Sidebar'
import Analysis from './Analysis'
import SettingCollection from './Settings'
import Dispense from './dispense'
import Users from './Users'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Layout = () => {
    const role = JSON.parse(localStorage.getItem("role"));
    const location = useLocation()
    
    return (
        <section className="login vh-100">
            <div className="container-fluid p-0 w-100">
                <div className="row m-0">
                    {
                       ( location.pathname !== '/signUp' && location.pathname !== '/' ) && <Sidebar />
                    }
                        <ToastContainer />
                    <Routes>
                        <Route path='/signUp' element={<Signup />} />
                        <Route path='/' element={<Login />} />
                        {(role && role === "1") && <Route path='/collection' element={<FileCollection />} />}
                        <Route path='/patient' element={<Patient />} />
                        <Route path='/lenses' element={<Lenses />} />
                        {/* <Route path='/boxvalue' element={<Boxvalue />} /> */}
                        <Route path='/dispense' element={<Dispense />} />
						<Route path='/search/:id?' element={<Analysis />} />
						{(role && role === "1") &&<Route path='/setting' element={<SettingCollection />} /> }
                        {(role && role === "1") && (<Route path='/users' element={<Users />} />)}
                    </Routes>
                </div>
            </div>
        </section>
    )
}

export default Layout