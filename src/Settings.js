import React, { useState, useEffect, useRef } from 'react'
import ReactTable from './ReactTable';
import ReactSettingTable from './ReactSettingTable'

const SettingCollection = () => {
    const childRef = useRef();
    const [settingListing, setSettingListing] = useState([]);
    const [eyewearConfig, setEyeWearConfig] = useState([]);
    const [axisConfig, setAxisConfig] = useState([]);
    const [configData, setConfigData] = useState([]);
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState("");

    const columns = [
        {
            Header: 'New value',
            accessor: 'NewValue',
            className: 'px-3 py-3',
        },
        {
            Header: 'Current value',
            accessor: 'CurrentValue',
            className: 'px-3 py-3',
        },
        {
            Header: 'Parameters',
            accessor: 'Parameters',
            className: 'px-3 py-3',
        },
        {
            Header: 'Description',
            accessor: 'Description',
            className: 'px-3 py-3',
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <ActionCell
                    row={row}
                    submitEdits={submitEdits} // Pass your update function here
                //   handleDelete={handleDelete} // Pass your handleDelete function here
                />
            ),
            className: 'px-3 py-3',
        },
    ];


    const columns2 = [
        {
            Header: 'NewValue',
            columns: [
                {
                    Header: 'AxisMin',
                    accessor: 'NewAxisMin',
                    className: 'px-3 py-3',
                },
                {
                    Header: 'AxisMax',
                    accessor: 'NewAxisMax',
                    className: 'px-3 py-3',
                },
            ],
        },

        {
            Header: 'CurrentValue',
            columns: [
                {
                    Header: 'AxisMin',
                    accessor: 'CurrentAxisMin',
                    className: 'px-3 py-3',
                },
                {
                    Header: 'AxisMax',
                    accessor: 'CurrentAxisMax',
                    className: 'px-3 py-3',
                },
            ],
        },
        {
            Header: 'CylinderRanges',
            columns: [
                {
                    Header: 'CylMin',
                    accessor: 'CylMin',
                    className: 'px-3 py-3',
                },
                {
                    Header: 'CylMax',
                    accessor: 'CylMax',
                    className: 'px-3 py-3',
                },
            ],
        },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <ActionCell
                    row={row}
                    submitAxisConfigEdits={submitAxisConfigEdits} // Pass your update function here
                //   handleDelete={handleDelete} // Pass your handleDelete function here
                />
            ),
            className: 'px-3 py-3',
        },
    ];

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('userId'))
        setUserId(userId);
        const role = JSON.parse(localStorage.getItem('role'));
        setRole(role);

    }, []);


    useEffect(() => {
        if (userId) {
            getdata();
            // getCollections();
        }
    }, [userId]);

    const getdata = async () => {
        const getResponse = await fetch(`http://localhost:8080/api/v1/config?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('token'))
            }

        });
        if (getResponse.ok) {
            const data = await getResponse.json();
            console.log(data);
            setConfigData(data);
            setEyeWearConfig(data.eyeWearConfig)
            setAxisConfig(data.axisConfig)
            console.log('datadata data', data);
        } else {
            console.log('Get Failed');
        }

    }

    const submitEdits = async (coll) => {
        const data = {
            id: coll.Id,
            NewValue: coll.NewValue,
        }
        if (data.NewValue && data.id) {
            const response = await fetch(`http://localhost:8080/api/v1/update-eyewear-config`, {
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
            // setCollection({
            //     Coll_id: "",
            //     Coll_name: "",
            //     Coll_date: "",
            //     Coll_desc: ""
            // })
            // setTodoEditing(false);
        }
    };

    const submitAxisConfigEdits = async (coll) => {
        const data = {
             id: coll.Id,
             NewAxisMax:coll.NewAxisMax,
             NewAxisMin:coll.NewAxisMin
            // NewValue: coll.NewValue,
        }
        if (data.id &&  (data.NewAxisMax || data.NewAxisMin)) {
            const response = await fetch(`http://localhost:8080/api/v1/update-axis-config`, {
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
            // setCollection({
            //     Coll_id: "",
            //     Coll_name: "",
            //     Coll_date: "",
            //     Coll_desc: ""
            // })
            // setTodoEditing(false);
        }
    };
    const ActionCell = ({ row, submitEdits, submitAxisConfigEdits, handleDelete }) => (
        <td>
            <div>
                {/* <button className="btn btn-primary me-3" onClick={() =>
                console.log("row.originalrow.original",row.original);
                      submitEdits(row.original)
                     }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                    </svg>
                </button> */}

                <button className="btn btn-primary me-3" onClick={() => {
                    console.log("row.original", row.original.CurrentAxisMax);
                    row.original.CurrentAxisMax? submitAxisConfigEdits(row.original): submitEdits(row.original);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                    </svg>
                </button>



                {/* <button className="btn btn-primary bg-danger" onClick={() => handleDelete(row.original.id)}>
                    <strong>Delete</strong>
                </button> */}
                {/* <button className="btn btn-primary me-3" onClick={() => submitAxisConfigEdits(row.original)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                    </svg>
                </button> */}
            </div>
        </td>
    );

    console.log('configData.eyeWearConfig', configData.eyeWearConfig)
    return (
        <div className="col p-5" style={{ marginRight: 34 }}>
            <div className="user_style">
                <div className="user_name">
                    <h2>Configration</h2>
                    <hr className="mt-4" />
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="table_card setting_table rounded">
                            <ReactSettingTable
                                ref={childRef}
                                columns={columns}
                                data={eyewearConfig}
                                //   selectOptions={configData}
                                role={role} />
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="table_card setting_table rounded">
                            <ReactSettingTable
                                ref={childRef}
                                columns={columns2}
                                data={axisConfig}
                                //   selectOptions={configData}
                                role={role} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SettingCollection