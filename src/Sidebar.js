import React, { useEffect, useState } from "react";
import Img0 from "./images/hopefulWaysLogo.JPG";
import Img1 from "./images/user.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { API_URL } from "./helper/common";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
    setFirstName(JSON.parse(localStorage.getItem("firstName")));
  }, []);
  const handleSignOut = async () => {
    const response = await fetch(`${API_URL}/v1/signOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (response.ok) {
      navigate("/");
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      localStorage.removeItem("token");
      localStorage.removeItem("selectedLensCollectionId");
      localStorage.removeItem("collId");
    } else {
      console.log("Signout failed");
    }
  };
  // const handleClearDB = async () => {
  //   const response = await fetch(`${API_URL}/v1/cleardb`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Authorization: localStorage.getItem('token'), // Add the authorization token if needed
  //     },
  //   });

  //   if (response.ok) {
  //     window.location.reload();
  //     console.log('Database cleared successfully');
  //   } else {
  //     console.log('Failed to clear the database');
  //   }
  // };

  return (
    <>
      <header className="top_header">
        <div className="row">
          <div className="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="container-fluid">
                <a class="navbar-brand" href="#">
                  <img src={Img0} width="100px" alt="" />
                </a>
                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div
                  class="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="menu_list navbar-nav m-auto mb-0 gap-3">
                  {role == 1 && (
                    <li
                      className={
                        location.pathname == "/collection"
                          ? "px-3 nav-item active"
                          : "px-3 nav-item"
                      }
                    >
                      {/* <li className="px-3 active" onClick={() => {setActive('collection')}}> */}
                      <Link to="/collection">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-collection-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z" />
                        </svg>
                        Collection
                      </Link>
                    </li>
                  )}
                    {/* <li
                      className={
                        location.pathname == "/boxvalue"
                          ? "px-3 nav-item active"
                          : "px-3 nav-item"
                      }
                    >
                      <Link to="/boxvalue">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-box-seam-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z"
                          />
                        </svg>
                        Box Values
                      </Link>
                    </li> */}
                    <li
                      className={
                        location.pathname == "/lenses"
                          ? "px-3 nav-item active"
                          : "px-3 nav-item"
                      }
                    >
                      <Link to="/lenses">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-eye-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                        Lenses
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/patient"
                          ? "px-3 nav-item active"
                          : "px-3 nav-item"
                      }
                    >
                      <Link to="/patient">
                        <svg
                          width="16"
                          height="16"
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
                    <li
                      className={
                        location.pathname == "/search"
                          ? "px-3 nav-item active"
                          : "px-3 nav-item"
                      }
                    >
                      <Link to="/search">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        Search
                      </Link>
                    </li>

                      <li
                        className={
                          location.pathname == "/dispense"
                            ? "px-3 nav-item active"
                            : "px-3 nav-item"
                        }
                      >
                        <Link to="/dispense">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-clipboard2-pulse-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
                            <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M9.98 5.356 11.372 10h.128a.5.5 0 0 1 0 1H11a.5.5 0 0 1-.479-.356l-.94-3.135-1.092 5.096a.5.5 0 0 1-.968.039L6.383 8.85l-.936 1.873A.5.5 0 0 1 5 11h-.5a.5.5 0 0 1 0-1h.191l1.362-2.724a.5.5 0 0 1 .926.08l.94 3.135 1.092-5.096a.5.5 0 0 1 .968-.039Z" />
                          </svg>
                          Dispense
                        </Link>
                      </li>
                

                    {role == 1 && (
                      <li
                        className={
                          location.pathname == "/setting"
                            ? "px-3 nav-item active"
                            : "px-3 nav-item"
                        }
                      >
                        <Link to="/setting">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-gear-wide-connected"
                            viewBox="0 0 16 16"
                          >
                            <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                          </svg>
                          Setting
                        </Link>
                      </li>
                    )}

                    {role == 1 && (
                      <li
                        className={
                          location.pathname == "/users"
                            ? "px-3 nav-item active"
                            : "px-3 nav-item"
                        }
                      >
                        <Link to="/users">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-person-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path
                              fill-rule="evenodd"
                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                            />
                          </svg>
                          Users
                        </Link>
                      </li>
                    )}

                    
                  </ul>

                  <ul className="header_user_detail d-flex align-items-center justify-content-end">
                  {/* {role == 1 && (
                  <li>
                      <button
                        className="btn btn-primary"
                        onClick={handleClearDB} 
                      >
                        Clear Db
                      </button>
                    </li>
                        )} */}
                    <li>
                      <span className="user_icon">
                        <img src={Img1} width="50px" alt="" />
                      </span>
                      <span>{firstName}</span>
                    </li>
                    <li>
                      <button
                        className="btn btn-primary"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          {/* <div className="col-6">
            <div className="sidebar_logo text-left">
              <h2></h2>
            </div>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-end">
          </div> */}
        </div>
      </header>
      {/* <div className="sidebar_outer p-0">
        <div className="sidebar">
          <div className="sidebar_menu mt-4">
            <ul className="menu_list">
              <li
                className={
                  location.pathname == "/collection" ? "px-3 active" : "px-3"
                }
              >
                <Link to="/collection">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-collection-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z" />
                  </svg>
                  Collection
                </Link>
              </li>
              <li
                className={
                  location.pathname == "/boxvalue"
                    ? "px-3 mt-2 active"
                    : "px-3 mt-2"
                }
              >
                <Link to="/boxvalue">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-box-seam-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z"
                    />
                  </svg>
                  Box Values
                </Link>
              </li>
              <li
                className={
                  location.pathname == "/lenses"
                    ? "px-3 mt-2 active"
                    : "px-3 mt-2"
                }
              >
                <Link to="/lenses">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                  Lenses
                </Link>
              </li>
              <li
                className={
                  location.pathname == "/patient"
                    ? "px-3 mt-2 active"
                    : "px-3 mt-2"
                }
              >
                <Link to="/patient">
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
              <li
                className={
                  location.pathname == "/search"
                    ? "px-3 mt-2 active"
                    : "px-3 mt-2"
                }
              >
                <Link to="/search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                  Search
                </Link>
              </li>

              {role == 1 && (
                <li
                  className={
                    location.pathname == "/setting"
                      ? "px-3 mt-2 active"
                      : "px-3 mt-2"
                  }
                >
                  <Link to="/setting">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                    </svg>
                    Setting
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Sidebar;
