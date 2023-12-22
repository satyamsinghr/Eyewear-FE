import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTable, useRowSelect, useSortBy } from "react-table";

const ReactTable = forwardRef(
  (
    { columns, data, handleSubmit, selectOptions, setCollectionListing ,role},
    ref
  ) => {
    const [newRowData, setNewRowData] = useState(() => {
      const initialRow = {};
      columns.forEach(async (column) => {
        if (column.accessor != "action") {
          initialRow[column.accessor] = "";
        }
        if (column.accessor === "Lens_Status") {
          initialRow[column.accessor] = "available";
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
      });
      setNewRowData(initialRow);
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
        { name: "dispensed", value: "dispensed" },
        { name: "trashed", value: "trashed" }
      ];
    const CellRenderer = ({ cell, row, selectOptions, setNewRow }) => {
      return (
        <td {...cell.getCellProps()}>
          {cell.column.id !== "action" ? (
            // Check if the column accessor is "Box_Name"
            cell.column.id === "Box_Names" ? (
              <select
                className="form-control"
                placeholder="Select a Name"
                onChange={(e) => {
                  const updatedData = [...data];
                  const rowIndex = row.index;
                  const columnId = "Box_id";
                  const box = selectOptions.find(
                    (x) => x.id === e.target.value
                  );
                  updatedData[rowIndex][columnId] = e.target.value;
                  updatedData[rowIndex]["Box_Name"] = box.Box_Name;
                  setCollectionListing(updatedData);

                  // Update the state with the modified data
                  const updatedRow = {
                    ...row.original,
                    [columnId]: e.target.value,
                    ["Box_Name"]: box.Box_Name,
                  };
                  // Update the row in the original data array
                  updatedData[rowIndex] = updatedRow;
                  row.original.Box_id = e.target.value;
                }}
                value={row.original.Box_id || ""}
              >
                <option disabled selected value="">
                  Select a Name
                </option>
                {selectOptions.map((val, index) => (
                  <option key={index} value={val.id}>
                    {val.Box_Name}
                  </option>
                ))}
              </select>
            ) : // Render other columns with contentEditable

            cell.column.id === "Lens_Status" ? (
              <select
                className="form-control"
                placeholder="Select a Name"
                onChange={(e) => {
                  const updatedData = [...data];
                  const rowIndex = row.index;
                  const columnId = cell.column.id ;
                  
                  updatedData[rowIndex][columnId] = e.target.value;

                  // Update the state with the modified data
                  const updatedRow = {
                    ...row.original,
                    [columnId]: e.target.value,
                  };
                  // Update the row in the original data array
                  updatedData[rowIndex] = updatedRow;
                  setCollectionListing(updatedData);
                //   row.original.Box_id = e.target.value;
                }}
                value={row.original.Lens_Status || ""}
              >
                <option disabled selected value="">
                  Select a Name
                </option>
                {statusArray.map((val, index) => (
                  <option key={index} value={val.value}>
                    {val.name}
                  </option>
                ))}
              </select>
            ) : (
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
            )
          ) : null}
        </td>
      );
    };

    const setNewRow = (columnId, value) => {
      setNewRowData((prevRow) => ({ ...prevRow, [columnId]: value }));
    };

    console.log("table data", data);
    return (
      <table
        {...getTableProps()}
        style={{ width: "100%" }}
        className="collection_table"
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
                    ) : column.accessor === "Box_Names" ? (
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
                          return <option value={val.id}>{val.Box_Name}</option>;
                        })}
                      </select>
                    ) : (
                      <input
                        type={
                          column.accessor === "Coll_date" ||
                          column.accessor === "Box_date"
                            ? "date"
                            : "text"
                        }
                        value={newRowData[column.accessor]}
                        onChange={(e) =>
                          setNewRow(column.accessor, e.target.value)
                        }
                      />
                    )}
                  </td>
                )
            )}
            <td>
              {/* Render the Save button for the new row */}
              <button
                className="btn btn-primary me-3 w-100"
                onClick={(e) => handleSubmit(e, newRowData)}
              >
                Save
              </button>
            </td>
          </tr>
          )}
          {rows.map((row) => {
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
    );
  }
);

export default ReactTable;
