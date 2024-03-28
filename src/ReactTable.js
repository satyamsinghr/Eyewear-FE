import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTable, useRowSelect, useSortBy, usePagination } from "react-table";
import Select from 'react-select';
// import 'react-select/styles.css';
import Multiselect from 'multiselect-react-dropdown';


const ReactTable = forwardRef(
  (
    {
      columns,
      data,
      handleSubmit,
      selectOptions,
      setCollectionListing,
      role,
      tableType,
      submitEdits,
      collectionListing,
    },
    ref
  ) => {
    const [newRowData, setNewRowData] = useState(() => {
      const initialRow = {};
      columns.forEach(async (column) => {
        if (column.accessor != "action") {
          initialRow[column.accessor] = "";
        }
        if (column.accessor === "Lens_Status") {
          // initialRow[column.accessor] = "available1";
        } else {
          initialRow[column.accessor] = "";
        }
      });
      return initialRow;
    });

    useImperativeHandle(ref, () => ({
      resetNewRowData,
    }));

    const resetNewRowData = () => {
      const initialRow = {};
      columns.forEach(async (column) => {
        if (column.accessor != "action") {
          initialRow[column.accessor] = "";
        }
        // if (column.accessor === "Lens_Status") {
        //   initialRow[column.accessor] = "available";
        // } 
        else {
          initialRow[column.accessor] = "";
        }
      });
      setNewRowData(initialRow);
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
      state,
      canPreviousPage,
      canNextPage,
      pageCount,
      nextPage,
      pageSize,
      gotoPage,
      setPageSize,
      previousPage, } =
      useTable(
        {
          columns,
          data,
          initialState: {
            pageIndex: 0,
            pageSize: 5,
            sortBy: [
              // {
              //   id: "id", // default sorting column
              //   desc: false, // default sorting order (false for ascending)
              // },
            ],
          },
        },
        useSortBy,
        usePagination,
        useRowSelect,
      );

    // const CellRenderer = ({ cell, row }) => {
    //     return (
    //         <td {...cell.getCellProps()}>
    //             {cell.column.id !== 'action' ? (
    //                 <div
    //                     contentEditable
    //                     suppressContentEditableWarning
    //                     onBlur={(e) => {
    //                         const updatedData = [...data];
    //                         const rowIndex = row.index;
    //                         const columnId = cell.column.id;

    //                         updatedData[rowIndex][columnId] = e.target.innerHTML;
    //                         // setData(updatedData);
    //                     }}
    //                     dangerouslySetInnerHTML={{ __html: cell.value }}
    //                 />
    //             ) : null}
    //         </td>
    //     );
    // };

    const statusArray = [
      { name: "selected", value: "selected" },
      { name: "available", value: "available" },
      { name: "missing", value: "missing" },
      { name: "reading", value: "reading" },
      { name: "dispensed", value: "dispensed" },
      { name: "trashed", value: "trashed" },
    ];
    const lensStatus = [
      { name: "available", value: "available" },
      { name: "reading", value: "reading" },
    ];

    const CellRenderer = ({
      cell,
      row,
      selectOptions,
      setCollectionListing,
      statusArray,
      collectionListing
    }) => {
      const handleSelectChange = (columnId, value) => {
        const updatedData = [...data];
        const rowIndex = row.index;

        updatedData[rowIndex][columnId] = value;
        const updatedRow = {
          ...row.original,
          [columnId]: value,
        };
        updatedData[rowIndex] = updatedRow;
        submitEdits(updatedRow);
      };


      const handleMultiSelectChange = (columnId, value) => {
        const updatedData = [...data];
        const rowIndex = row.index;
        updatedData[rowIndex][columnId] = value;
        const updatedRow = {
          ...row.original,
          [columnId]: value,
        };
        updatedData[rowIndex] = updatedRow;
        submitEdits(updatedRow);
      };

      const renderSelect = (columnId, options) => {
        // const isCollectionId = columnId === 'CollectionId';
        if (columnId === "Coll_id") {
          return (
            <Multiselect
              options={[
                { value: 'all', label: 'Select All' },
                ...collectionListing.map((val) => ({
                  id: val.id,
                  label: val.Coll_name
                }))
              ]}
              displayValue="label"
              onSelect={(selectedList, selectedItem) => {
                if (selectedItem && selectedItem.value === 'all') {
                  const allValues = collectionListing.map(val => ({
                    id: val.id,
                    label: val.Coll_name
                  }));
                  handleMultiSelectChange(columnId, allValues);
                }
                else {
                  const filteredList = selectedList.filter(item => item.value !== 'all');
                  handleMultiSelectChange(columnId, filteredList);
                }
              }}
              onRemove={(selectedList) => handleMultiSelectChange(columnId, selectedList)}
              placeholder="Select Collection"
              selectedValues={row.original["Collections"] || []}
            />
          );
        } else {
          return (
            <select
              className="form-control"
              placeholder="Select a Name"
              onChange={(e) => handleSelectChange(columnId, e.target.value)}
              value={row.original[columnId] || ""}
            >
              {/* {isCollectionId ? (
                <option disabled selected value="">
                  Select Collection
                </option>
              ) : <option disabled selected value="">
                Select a Name
              </option>} */}
              <option disabled selected value="">
                Select a Name
              </option>
              {options.map((val, index) => (
                <option key={index} value={val.id || val.value}>
                  {val.Coll_name || val.name}
                </option>
              ))}
            </select>
          );
        }
      };

      const renderEditableCell = (columnId) => {
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const updatedData = [...data];
              const rowIndex = row.index;
              updatedData[rowIndex][columnId] = e.target.innerHTML;
              // setData(updatedData);
            }}
            dangerouslySetInnerHTML={{ __html: cell.value }}
          />
        );
      };

      return (
        <td {...cell.getCellProps()}>
          {cell.column.id !== "action" && (
            <>
              {cell.column.id === "Lens_Status" &&
                renderSelect(cell.column.id, statusArray)}
              {cell.column.id === "Collection_id" &&
                renderSelect("CollectionId", collectionListing)}
              {cell.column.id === "Coll_Id" &&
                renderSelect("Coll_id", collectionListing)}
              {cell.column.id !== "password" &&
                cell.column.id !== "id" &&
                cell.column.id !== "email" &&
                cell.column.id !== "Lens_Status" &&
                cell.column.id !== "Box_Names" &&
                cell.column.id !== "Collection_id" &&
                cell.column.id !== "Coll_Id" &&
                renderEditableCell(cell.column.id)}
              {(cell.column.id === "id" || cell.column.id === "email") && (
                <div dangerouslySetInnerHTML={{ __html: cell.value }} />
              )}

              {/* {cell.column.id === "Lens_Status" &&
                renderSelect(cell.column.id, statusArray)}
                 {cell.column.id === "Collection_id" &&
                renderSelect("CollectionId", collectionListing)}
              {cell.column.id === "Collection_Id" &&
                renderSelect("Coll_id", collectionListing)}
              {cell.column.id !== "password" &&
                cell.column.id !== "id" &&
                cell.column.id !== "email" &&
                cell.column.id !== "Lens_Status" &&
                cell.column.id !== "Box_Names" &&
                cell.column.id !== "Collection_id" &&
                // cell.column.id !== "Coll_id" &&
                renderEditableCell(cell.column.id)}
              {(cell.column.id === "id" || cell.column.id === "email") && (
                <div dangerouslySetInnerHTML={{ __html: cell.value }} />
              )}
  */}

              {cell.column.id === "password" && (
                <input
                  type="text"
                  placeholder="Change Password"
                  onChange={
                    (e) => {
                      const updatedData = [...data];
                      const rowIndex = row.index;
                      updatedData[rowIndex][cell.column.id] = e.target.value;
                    }
                    // setPassword(cell.column.id, e.target.value)
                  }
                />
              )}
            </>
          )}
        </td>
      );
    };

    // const CellRenderer = ({ cell, row, selectOptions, setNewRow }) => {
    //   return (
    //     <td {...cell.getCellProps()}>
    //       {cell.column.id !== "action" ? (
    //         // Check if the column accessor is "Box_Name"
    //         cell.column.id === "Box_Names" ? (
    //           <select
    //             className="form-control"
    //             placeholder="Select a Name"
    //             onChange={(e) => {
    //               const updatedData = [...data];
    //               const rowIndex = row.index;
    //               const columnId = "Box_id";
    //               const box = selectOptions.find(
    //                 (x) => x.id === e.target.value
    //               );
    //               updatedData[rowIndex][columnId] = e.target.value;
    //               updatedData[rowIndex]["Box_Name"] = box.Box_Name;
    //               setCollectionListing(updatedData);

    //               // Update the state with the modified data
    //               const updatedRow = {
    //                 ...row.original,
    //                 [columnId]: e.target.value,
    //                 ["Box_Name"]: box.Box_Name,
    //               };
    //               // Update the row in the original data array
    //               updatedData[rowIndex] = updatedRow;
    //               row.original.Box_id = e.target.value;
    //             }}
    //             value={row.original.Box_id || ""}
    //           >
    //             <option disabled selected value="">
    //               Select a Name
    //             </option>
    //             {selectOptions.map((val, index) => (
    //               <option key={index} value={val.id}>
    //                 {val.Box_Name}
    //               </option>
    //             ))}
    //           </select>
    //         ) : // Render other columns with contentEditable

    //         cell.column.id === "Lens_Status" ? (
    //           <select
    //             className="form-control"
    //             placeholder="Select a Name"
    //             onChange={(e) => {
    //               const updatedData = [...data];
    //               const rowIndex = row.index;
    //               const columnId = cell.column.id ;

    //               updatedData[rowIndex][columnId] = e.target.value;

    //               // Update the state with the modified data
    //               const updatedRow = {
    //                 ...row.original,
    //                 [columnId]: e.target.value,
    //               };
    //               // Update the row in the original data array
    //               updatedData[rowIndex] = updatedRow;
    //               setCollectionListing(updatedData);
    //             //   row.original.Box_id = e.target.value;
    //             }}
    //             value={row.original.Lens_Status || ""}
    //           >
    //             <option disabled selected value="">
    //               Select a Name
    //             </option>
    //             {statusArray.map((val, index) => (
    //               <option key={index} value={val.value}>
    //                 {val.name}
    //               </option>
    //             ))}
    //           </select>
    //         ) : (
    //           cell.column.id !== "password" || cell.column.id !== "id" || cell.column.id !== "email" ?
    //           (<div
    //             contentEditable
    //             suppressContentEditableWarning
    //             onBlur={(e) => {
    //               const updatedData = [...data];
    //               const rowIndex = row.index;
    //               const columnId = cell.column.id;

    //               updatedData[rowIndex][columnId] = e.target.innerHTML;
    //               // setData(updatedData);
    //             }}
    //             dangerouslySetInnerHTML={{ __html: cell.value }}
    //           />)
    //           :
    //           (
    //             <div dangerouslySetInnerHTML={{ __html: cell.value }} />
    //           )
    //         )
    //       ) : null}
    //     </td>
    //   );
    // };

    const setNewRow = (columnId, value) => {
      setNewRowData((prevRow) => ({ ...prevRow, [columnId]: value }));
    };
    const setPassword = (columnId, value) => {
      // setNewRowData((prevRow) => ({ ...prevRow, [columnId]: value }));
    };

    const handlePageSizeChange = size => {
      setPageSize(size);
    };

    return (
      <div>
        <table
          {...getTableProps()}
          style={{ width: "100%" }}
          className="collection_table active_table"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {parseInt(role) == 1 && (
              <tr>
                {columns.map(
                  (column, columnIndex) =>
                    // Check if the current column is not the action column
                    columnIndex !== columns.length - 1 && (
                      <td key={column.accessor}>
                        {column.accessor === "Col_type" ? (
                          <select
                            className="form-control"
                            id="floatingInput"
                            placeholder="Lens Type"
                            onChange={(e) =>
                              setNewRow(column.accessor, e.target.value)
                            }
                            value={newRowData[column.accessor]}
                            defaultValue=""
                          >
                            <option disabled selected value="">
                              Select a Name
                            </option>
                            {selectOptions.map((val, index) => {
                              return (
                                <option value={val.id}>{val.Coll_name}</option>
                              );
                            })}
                          </select>
                        ) :
                          column.accessor === "Lens_Status" ? (
                            <select
                              className="form-control"
                              id="floatingInput"
                              placeholder="Lens Type"
                              onChange={(e) =>
                                setNewRow(column.accessor, e.target.value)
                              }
                              value={newRowData[column.accessor]}
                              defaultValue=""
                            >
                              <option disabled selected value="">
                                Select Lens
                              </option>
                              {lensStatus.map((val, index) => {
                                return (
                                  <option value={val.name}>{val.name}</option>
                                );
                              })}
                            </select>
                          )
                          //  :
                          //   column.accessor === "Collection_id" ? (
                          //     <select
                          //       className="form-control"
                          //       id="floatingInput"
                          //       placeholder="Collid"
                          //       onChange={(e) => setNewRow(column.accessor, e.target.value)}
                          //       value={newRowData[column.accessor]}
                          //       defaultValue=""
                          //     >
                          //       <option disabled selected value="">
                          //         Select Collection
                          //       </option>
                          //       {collectionListing.map((val, index) => (
                          //         <option key={index} value={val.id}>
                          //           {val.Coll_name}
                          //         </option>
                          //       ))}
                          //     </select>
                          //   )
                              :
                              column.accessor === "Coll_Id" && tableType === "users" ? (
                                // <Multiselect
                                //   options={collectionListing.map((val) => ({
                                //     value: val.id,
                                //     label: val.Coll_name
                                //   }))}
                                //   selectedValues={newRowData[column.accessor]}
                                //   onSelect={(selectedList, selectedItem) => {
                                //     setNewRow(column.accessor, selectedList);
                                //   }}
                                //   onRemove={(selectedList, removedItem) => {
                                //     setNewRow(column.accessor, selectedList);
                                //   }}
                                //   displayValue="label"
                                // />

                                <Multiselect
                                  options={[
                                    { value: 'all', label: 'Select All' },  // Option for selecting all
                                    ...collectionListing.map((val) => ({
                                      value: val.id,
                                      label: val.Coll_name
                                    }))
                                  ]}
                                  selectedValues={newRowData[column.accessor] || []}
                                  onSelect={(selectedList, selectedItem) => {
                                    if (selectedItem && selectedItem.value === 'all') {
                                      // const allValues = collectionListing.map(val => val);
                                      const allValues = collectionListing.map(val => ({
                                        value: val.id,
                                        label: val.Coll_name
                                      }));
                                      setNewRow(column.accessor, allValues);
                                    } else {
                                      const filteredList = selectedList.filter(item => item.value !== 'all');
                                      setNewRow(column.accessor, filteredList);
                                    }
                                  }}
                                  onRemove={(selectedList, removedItem) => {
                                    if (removedItem && removedItem.value === 'all') {
                                      setNewRow(column.accessor, []);
                                    } else {
                                      setNewRow(column.accessor, selectedList);
                                    }
                                  }}
                                  displayValue="label"
                                />

                                // <Select
                                //   options={[
                                //     { value: 'all', label: 'Select All' },  // Option for selecting all
                                //     ...collectionListing.map((val) => ({
                                //       value: val.id,
                                //       label: val.Coll_name
                                //     }))
                                //   ]}
                                //   isMulti
                                //   value={newRowData[column.accessor] || []}
                                //   onChange={(selectedOptions) => {
                                //     if (selectedOptions.some(option => option.value === 'all')) {
                                //       const allValues = collectionListing.map(val => val.id);
                                //       setNewRow(column.accessor, allValues);
                                //     } else {
                                //       const filteredOptions = selectedOptions.filter(option => option.value !== 'all');
                                //       setNewRow(column.accessor, filteredOptions);
                                //     }
                                //   }}
                                // />

                              )
                                : (
                                  <input
                                    disabled={
                                      column.accessor === "id" && tableType === "users"
                                    }
                                    type={
                                      (column.accessor === "Coll_date" || column.accessor === "Box_date")
                                        ? "date"
                                        : (column.accessor === "Coll_id" && tableType === "users")
                                          ? "select"
                                          : "text"
                                    }

                                    value={newRowData[column.accessor]}
                                    onChange={(e) =>
                                      setNewRow(column.accessor, e.target.value)
                                    }
                                  />
                                  // <input
                                  //   disabled={
                                  //     column.accessor === "id" && tableType === "users"
                                  //   }
                                  //   type={
                                  //     column.accessor === "Coll_date" ||
                                  //       column.accessor === "Box_date"
                                  //       ? "date"
                                  //       : "text"
                                  //   }
                                  //   value={newRowData[column.accessor]}
                                  //   onChange={(e) =>
                                  //     setNewRow(column.accessor, e.target.value)
                                  //   }
                                  // />
                                )
                        }
                      </td>
                    )
                )}
                <td className="text-center">
                  {/* Render the Save button for the new row */}
                  <button
                    className="btn btn-primary table_save"
                    onClick={(e) => handleSubmit(e, newRowData)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
            {rows.slice(state.pageIndex * state.pageSize, (state.pageIndex + 1) * state.pageSize).map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) =>
                    // Conditionally render cells based on column id
                    cell.column.id !== "action" ? (
                      <CellRenderer
                        cell={cell}
                        value={cell.render("Cell")}
                        row={row}
                        selectOptions={selectOptions}
                        statusArray={statusArray}
                        collectionListing={collectionListing}
                        key={cell.getCellProps().key}
                      />
                    ) : (
                      <td {...cell.getCellProps()}>
                        {cell.column.render("Cell", { row })}{" "}
                        {/* Pass the row to the render function */}
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex table_pagination mt-3 align-items-center justify-content-end gap-3">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <button className="pagination_button" onClick={() => previousPage()} disabled={!canPreviousPage}>
              {/* Previous */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span>
              Page{' '}
              <strong>
                {state.pageIndex + 1} of {pageCount}
              </strong>
            </span>
            <button className="pagination_button" onClick={() => nextPage()} disabled={!canNextPage}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="m-0 d-flex align-items-cneter pe-3">

            <div className="d-flex align-items-center">
              <span className="d-inline-block me-2">Page Size :</span>
              <select
                value={pageSize}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center">
              <span className="me-2">Go to page:</span>
              <input
                type="number"
                min="1"
                max={pageCount}
                value={state.pageIndex + 1}
                onChange={e => {
                  const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                  if (pageNumber >= 0 && pageNumber < pageCount) {
                    gotoPage(pageNumber);
                  }
                }}
                style={{ width: '75px' }}
              />
            </div>


          </div>
        </div>
      </div>
    );
  }
);

export default ReactTable;
