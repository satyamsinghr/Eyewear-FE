import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { useTable, useRowSelect, useSortBy } from "react-table";
const InlineEditingTable = forwardRef(
  ({ columns, data, handleSubmit, role, API_URL,selectedCollectionId,userId ,roleData}, ref) => {

    const columnName = [
      "PatientId",
      // "PercentageS",
      // "PercentageB",
      "RSphere",
      "RCylinder",
      "RAxis",
      "RAdd",
      "LSphere",
      "LCylinder",
      "LAxis",
      "LAdd",
      "Lens_Status",
    ];
    const patientInputRef = useRef();
    const [patientData, setPatientData] = useState([]);
    const [newRowData, setNewRowData] = useState(() => {
      const initialRow = {};
      columnName.forEach(async (column) => {
        // if (column.accessor != 'action') {
        //     initialRow[column.accessor] = '';
        // }
        if (column === "Lens_Status") {
          initialRow[column] = "Patient";
        } else {
          initialRow[column] = "";
        }
      });
      // columns.forEach(async (column) => {
      //   if(column.accessor  == 'PatientId'){
      //       initialRow[column.accessor] = await generateUniqueAlphanumericStringForPatient();
      //   }
      //   else{
      //       if(column.accessor  != 'action')
      //         initialRow[column.accessor] = '';
      //   }
      // });
      return initialRow;
    });

    async function generateUniqueAlphanumericStringForPatient() {
      let uniqueString;
      // let existingRecord;
      const alphanumericChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      uniqueString = Array.from(
        { length: 6 },
        () =>
          alphanumericChars[
          Math.floor(Math.random() * alphanumericChars.length)
          ]
      ).join("");
      // do {
      //     // Generate a random string of length 12

      //     // Check if the generated string already exists in the database
      //     existingRecord = await Patient.findOne({
      //         where: {
      //             PatientId: uniqueString,
      //         },
      //     });

      //     // If the string exists, generate a new one
      // } while (existingRecord);

      return uniqueString;
    }

    useImperativeHandle(ref, () => ({
      resetNewRowData,
    }));

    const resetNewRowData = () => {
      const initialRow = {};

      columnName.forEach(async (column) => {
        // if (column.accessor != 'action')
        if (column === "Lens_Status") {
          initialRow[column] = "Patient";
        } else {
          initialRow[column] = "";
        }
      });
      // columns.forEach(async (column) => {
      //     if (column.accessor == 'PatientId') {
      //         initialRow[column.accessor] = await generateUniqueAlphanumericStringForPatient();
      //     }
      //     else {
      //         if (column.accessor != 'action')
      //             initialRow[column.accessor] = '';
      //     }
      // });
      setNewRowData(initialRow);
    };

    const handlePatientIdChange = async (e, column) => {
      if (column === "PatientId") {
        const value = e.target.value;
        if (value !== "") {
          try {
            const getResponse = await fetch(
              `${API_URL}/v1/filterpatientById?id=${value}`,
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
              if (data.Patient_Data && data.Patient_Data.length > 0) {
                const patientData = data.Patient_Data[0];
                if(roleData == 1){
                  if(data.Patient_Data[0].CollectionId==selectedCollectionId){
                    setPatientData(patientData);
                    setNewRowData({ ...patientData });
                  }else{
                    setNewRow(column, patientData[column]);
                  }
                }else{
                  if(data.Patient_Data[0].CollectionId==selectedCollectionId && data.Patient_Data[0].UserId == userId ){
                    setPatientData(patientData);
                    setNewRowData({ ...patientData });
                  }else{
                  setNewRow(column, patientData[column]);
                  }
                }
               
              }
               else {
                // setNewRowData({ ...newRowData, "PatientId": value });
                const initialRow = {};
                columnName.forEach((column) => {
                  if (column === "PatientId") {
                    initialRow[column] = value;
                  } else if (column === "Lens_Status") {
                    initialRow[column] = "Patient";
                  } else {
                    initialRow[column] = "";
                  }
                });
                setNewRowData(initialRow);
              }
            } 
            else {
              console.log("Get Failed");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          // setNewRow(column, e.target.value);
          resetNewRowData();
        }
      } else {
        setNewRow(column, e.target.value);
      }
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable(
        {
          columns,
          data,
          initialState: {
            sortBy: [
              {
                id: "id", // default sorting column
                desc: false, // default sorting order (false for ascending)
              },
            ],
          },
        },
        useSortBy,
        useRowSelect
      );

    const CellRenderer = ({ cell, row }) => {
      return (
        <td {...cell.getCellProps()}>
          {cell.column.id !== "action" ? (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const updatedData = [...data];
                const rowIndex = row.index;
                const columnId = cell.column.id;

                updatedData[rowIndex][columnId] = e.target.innerHTML;
                // setData(updatedData);
              }}
              dangerouslySetInnerHTML={{ __html: cell.value }}
            />
          ) : null}
        </td>
      );
    };

    const setNewRow = (columnId, value) => {
      setNewRowData((prevRow) => ({ ...prevRow, [columnId]: value }));
    };

    //   const ActionCell = ({ row, update, handleDelete }) => {
    //     return (
    //       <div>
    //         <button
    //           className="btn btn-primary me-3"
    //           onClick={() => update(row.original)}
    //         >
    //           <strong>Edit</strong>
    //         </button>
    //         <button
    //           className="btn btn-primary bg-danger"
    //           onClick={() => handleDelete(row.original.id)}
    //         >
    //           <strong>Delete</strong>
    //         </button>
    //       </div>
    //     );
    //   };
  //   useEffect(() => {
  //   // Focus the input element when the component mounts
  //   setTimeout(()=>{
  //     patientInputRef.current.focus();

  //   },3000)
  // }, []);
  useEffect(() => {
    const autoFocusInput = document.getElementById("pa0");
  
    if (autoFocusInput) {
      setTimeout(() => {
        autoFocusInput.focus();
      }, 2000);
    }
  }, []);
    return (
      <table
        {...getTableProps()}
        style={{ width: "100%" }}
        className="patitnet_table"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.Header === "." ? (
                    <button
                      className="btn btn-primary"
                      onClick={(e) => handleSubmit(e, newRowData)}
                    >
                      Save & Search
                    </button>
                  ) : (
                    <>
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {parseInt(role) !== 1 && (
            <tr>
              {columnName.map((column, columnIndex) => (
                <td key={column}>
                  <input
                    type="text"
                    id={"pa"+columnIndex}
                    // ref={patientInputRef}
                    value={newRowData[column]}
                    onChange={(e) => {
                      handlePatientIdChange(e, column);

                    }}
                    disabled={
                      column == "Lens_Status" || column == "Lens_Status"
                        ? true
                        : false
                    }
                    style={{ width: column === "PatientId" ? "calc(1ch * 15)" : "100%" }}
                    // autofocus={columnIndex == 0 ? true : false}
                  />
                </td>
                // )
              ))}
              <td></td>
              <td></td>
              {/* <td>
                        <button className="btn btn-primary me-3 w-100" onClick={(e) => handleSubmit(e, newRowData)}>Save & Serach</button>
                    </td> */}
            </tr>
          )}
          {/* {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                cell.column.id !== 'action' ? (
                                    <CellRenderer
                                        cell={cell}
                                        value={cell.render('Cell')}
                                        row={row}
                                        key={cell.getCellProps().key}
                                    />
                                ) : (
                                    <td {...cell.getCellProps()}>
                                        {cell.column.render('Cell', { row })} 
                                    </td>
                                )
                            ))}
                        </tr>

                    );
                })} */}
        </tbody>
      </table>
    );
  }
);

export default InlineEditingTable;
