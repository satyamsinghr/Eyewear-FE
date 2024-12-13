import React, { useState, useEffect, useRef } from "react";
import ReactTable from "./ReactTable";
import ReactSettingTable from "./ReactSettingTable";
import { useNavigate } from 'react-router';
import { API_URL } from "./helper/common";
import { handleSignOut } from './utils/service';

const SettingCollection = () => {
  const navigate = useNavigate();
  const childRef = useRef();
  const [settingListing, setSettingListing] = useState([]);
  const [eyewearConfig, setEyeWearConfig] = useState([]);
  const [axisConfig, setAxisConfig] = useState([]);
  const [editedeyewearConfig, setEditedeyewearConfig] = useState([]);
  const [editedaxisConfig, setEditedaxisConfig] = useState([]);
  const [configData, setConfigData] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const columns = [
    {
      Header: "New value",
      accessor: "NewValue",
      className: "px-3 py-3",
    },
    {
      Header: "Current value",
      accessor: "CurrentValue",
      className: "px-3 py-3",
    },
    {
      Header: "Parameters",
      accessor: "Parameters",
      className: "px-3 py-3",
    },
    {
      Header: "Description",
      accessor: "Description",
      className: "px-3 py-3",
    },
    // {
    //     Header: 'Action',
    //     accessor: 'action',
    //     Cell: ({ row }) => (
    //         <ActionCell
    //             row={row}
    //             submitEdits={submitEdits} // Pass your update function here
    //         //   handleDelete={handleDelete} // Pass your handleDelete function here
    //         />
    //     ),
    //     className: 'px-3 py-3',
    // },
  ];

  const columns2 = [
    {
      Header: "NewValue",
      columns: [
        {
          Header: "AxisMin",
          accessor: "NewAxisMin",
          className: "px-3 py-3",
        },
        {
          Header: "AxisMax",
          accessor: "NewAxisMax",
          className: "px-3 py-3",
        },
      ],
    },

    {
      Header: "CurrentValue",
      columns: [
        {
          Header: "AxisMin",
          accessor: "CurrentAxisMin",
          className: "px-3 py-3",
        },
        {
          Header: "AxisMax",
          accessor: "CurrentAxisMax",
          className: "px-3 py-3",
        },
      ],
    },
    {
      Header: "CylinderRanges",
      columns: [
        {
          Header: "CylMin",
          accessor: "CylMin",
          className: "px-3 py-3",
        },
        {
          Header: "CylMax",
          accessor: "CylMax",
          className: "px-3 py-3",
        },
      ],
    },
    // {
    //     Header: 'Action',
    //     accessor: 'action',
    //     Cell: ({ row }) => (
    //         <ActionCell
    //             row={row}
    //             submitAxisConfigEdits={submitAxisConfigEdits} // Pass your update function here
    //         //   handleDelete={handleDelete} // Pass your handleDelete function here
    //         />
    //     ),
    //     className: 'px-3 py-3',
    // },
  ];

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId) {
      setUserId(userId);
    }
    else{
        navigate('/')
    }
    const role = JSON.parse(localStorage.getItem("role"));
    setRole(role);
  }, []);

  useEffect(() => {
    if (userId) {
      getdata();
      // getCollections();
    }
  }, [userId]);

  const getdata = async () => {
        const getResponse = await fetch(
      `${API_URL}/v1/config?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    if (getResponse.ok) {
      const data = await getResponse.json();
      setConfigData(data);
      setEyeWearConfig(data.eyeWearConfig);
      const sortedAxisConfig = data.axisConfig.sort((a, b) => {
        const cylMaxA = parseFloat(a.CylMax);
        const cylMaxB = parseFloat(b.CylMax);
        return cylMaxA - cylMaxB;
    });
      setAxisConfig(sortedAxisConfig);
    } else {
      if (getResponse.status === 401) {
        handleSignOut(navigate);
      } else {
        console.log("Get Failed");
      }
    }
  };
  // const fixDecimalValue = (value) => {
  //   if (value.startsWith('.')) {
  //     return `0${value}`;
  //   }
  //   return value;
  // };
  const fixDecimalValue = (value) => {
    if (value.startsWith('-.')) {
      return `-0.${value.substring(2)}`;
    } else if (value.startsWith('.')) {
      return `0${value}`;
    }
    return value;
  };

  const submitEdits = async (e, coll) => {
    const data = coll
    .filter((row) => row && row.Id !== undefined && row.NewValue !== undefined)
    .map((row) => ({ Id: row.Id, CurrentValue: fixDecimalValue(row.NewValue) }));
    if (data.length) {
      const response = await fetch(
        `${API_URL}/v1/update-eyewear-config`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.ok) {
        console.log("Edit successful");
        getdata();
        setEditedeyewearConfig([])
      } else {
        console.log("Edit failed");
      }
      
    }
  };

  const submitAxisConfigEdits = async (e,coll) => {
        e.preventDefault();
    const data = coll
    .filter((row) => row && row.Id !== undefined && row.NewAxisMin !== undefined && row.NewAxisMax !== undefined)
    .map((row) => ({ Id: row.Id, CurrentAxisMin: row.NewAxisMin !== "" ? row.NewAxisMin : row.CurrentAxisMin, CurrentAxisMax: row.NewAxisMax !== "" ? row.NewAxisMax : row.CurrentAxisMax }));
  
    if (data.length) {
      const response = await fetch(
        `${API_URL}/v1/update-axis-config`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.ok) {
        console.log("Edit successful");
        getdata();
        setEditedaxisConfig([])
      } else {
        console.log("Edit failed");
      }
    }
  };

  return (
    <div className="col p-lg-5 px-md-0 px-0" style={{ marginRight: 34 }}>
      <div className="user_style">
        <div className="user_name">
          <h2>Configration</h2>
          <hr className="mt-4" />
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="table_card setting_table rounded pt-0 mt-4 setting_table">
            <button className="btn btn-primary float-end mb-3 " type="button" onClick={(e) => submitEdits(e, editedeyewearConfig)} >Save All</button>
              <ReactSettingTable
                tableType={"eyewearConfig"}
                ref={childRef}
                columns={columns}
                data={eyewearConfig}
                setEditedeyewearConfig={setEditedeyewearConfig}
                role={role}
              />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="table_card setting_table rounded pt-0 mt-4">
            <button className="btn btn-primary float-end mb-3" type="button" onClick={(e) => submitAxisConfigEdits(e, editedaxisConfig)} >Save All</button>
              <ReactSettingTable
                tableType={"axisConfig"}
                ref={childRef}
                columns={columns2}
                data={axisConfig}
                setEditedaxisConfig={setEditedaxisConfig}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingCollection;
