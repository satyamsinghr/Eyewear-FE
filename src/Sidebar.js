import React, { useEffect ,useState} from "react";
import Img0 from './images/hopefulWaysLogo.JPG'
import Img1 from './images/user.png'
import { useNavigate, Link ,useLocation} from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const[firstName, setFirstName] = useState('');
  useEffect(() => {
    setFirstName(JSON.parse(localStorage.getItem('firstName')))
  },[])
  const handleSignOut = async () => {
    const response = await fetch('http://localhost:8080/api/v1/signOut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('token'))
      },
    });
    if (response.ok) {
      navigate("/");
      localStorage.removeItem('userId')
      localStorage.removeItem('firstName')
      localStorage.removeItem('token')
    } else {
      console.log('Signout failed');
    }
  }

  return (
    <>
      <header className="top_header">
        <div className="row">
          <div className="col-6">
            <div className="sidebar_logo text-left">
              <h2>
                <img src={Img0} width="100px" alt="" />
              </h2>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-end">
            <ul className="header_user_detail d-flex align-items-center justify-content-end">
              <li>
                <span className="user_icon">
                  <img src={Img1} width="50px" alt="" />
                </span>
                <span>{firstName}</span>
              </li>
              <li>
                <button className="btn btn-primary" onClick={handleSignOut}>Sign Out</button>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="col-lg-3 p-0">
        <div className="sidebar">

          <div className="sidebar_menu mt-4">
            <ul className="menu_list">
              <li className={location.pathname == '/collection' ? 'px-3 active' : 'px-3'} >
              {/* <li className="px-3 active" onClick={() => {setActive('collection')}}> */}
                <Link to="/collection" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-collection-fill" viewBox="0 0 16 16">
                    <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z" />
                  </svg>

                  Collection
                </Link>
              </li>
              <li className={location.pathname == '/boxvalue'  ? 'px-3 mt-2 active' : 'px-3 mt-2'} >
              {/* <li className="px-3 mt-2" onClick={() => {setActive('box')}}> */}
                <Link to="/boxvalue" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-seam-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z" />
                  </svg>
                  Box Values
                </Link>
              </li>
              <li className={( location.pathname == '/lenses' ) ? 'px-3 mt-2 active' : 'px-3 mt-2'} >
                <Link to="/lenses">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                  Lenses
                </Link>
              </li>
              <li className={(location.pathname == '/patient') ? 'px-3 mt-2 active' : 'px-3 mt-2'} >
                <Link to="/patient" >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6867 12.6816C10.57 12.6699 10.43 12.6699 10.3017 12.6816C7.52501 12.5883 5.32001 10.3133 5.32001 7.51325C5.32001 4.65492 7.63001 2.33325 10.5 2.33325C13.3583 2.33325 15.68 4.65492 15.68 7.51325C15.6683 10.3133 13.4633 12.5883 10.6867 12.6816Z"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.145 4.66675C21.4083 4.66675 23.2283 6.49841 23.2283 8.75008C23.2283 10.9551 21.4783 12.7517 19.2967 12.8334C19.2033 12.8217 19.0983 12.8217 18.9933 12.8334"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.85334 16.9867C2.03001 18.8767 2.03001 21.9567 4.85334 23.8351C8.06167 25.9817 13.3233 25.9817 16.5317 23.8351C19.355 21.9451 19.355 18.8651 16.5317 16.9867C13.335 14.8517 8.07334 14.8517 4.85334 16.9867Z"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.3967 23.3333C22.2367 23.1583 23.03 22.8199 23.6833 22.3183C25.5033 20.9533 25.5033 18.7016 23.6833 17.3366C23.0417 16.8466 22.26 16.5199 21.4317 16.3333"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Patients
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
