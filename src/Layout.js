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

const Layout = () => {

    const location = useLocation()
    
    return (
        <section className="login vh-100">
            <div className="container-fluid p-0 w-100">
                <div className="row m-0">
                    {
                       ( location.pathname !== '/signUp' && location.pathname !== '/' ) && <Sidebar />
                    }
                    
                    <Routes>
                        <Route path='/signUp' element={<Signup />} />
                        <Route path='/' element={<Login />} />
                        <Route path='/collection' element={<FileCollection />} />
                        <Route path='/patient' element={<Patient />} />
                        <Route path='/lenses' element={<Lenses />} />
                        <Route path='/boxvalue' element={<Boxvalue />} />
						<Route path='/search/:id?' element={<Analysis />} />
						<Route path='/setting' element={<SettingCollection />} />
                    </Routes>
                </div>
            </div>
        </section>
    )
}

export default Layout