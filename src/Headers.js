import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from './helper/common';
const Headers = () => {

    const navigate = useNavigate();

    const handleSignOut = async () => {

        const response = await fetch(`${API_URL}/v1/signOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Signout successful');
            localStorage.clear();
        } else {
            console.log('Signout failed');
        }
        navigate("/login");
    }


    return (
        <>
            <header className="p-3 bg-secondary text-white">

                <nav>
                    <ul className="horizontal-list nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to="/collection" style={{ textDecoration: 'none', color: 'white', }}
                            >Collections</Link>
                        </li>
                        <li >
                            <Link to="/patient" style={{ textDecoration: 'none', color: 'white' }}>Patients</Link>
                        </li>
                        <li>
                            <Link to="/boxes" style={{ textDecoration: 'none', color: 'white' }}>Boxes</Link>
                        </li>
                        <li>
                            <Link to="/lenses" style={{ textDecoration: 'none', color: 'white' }}>Lenses</Link>
                        </li >
                    </ul>
                </nav>
                <div className='signOut'>

                    <button onClick={handleSignOut} className="btn btn-info">Sign Out</button>
                </div>


            </header>
        </>
    )
}

export default Headers