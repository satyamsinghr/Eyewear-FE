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
    {
      columns,
      data,
      selectOptions,
      tableType,
      role,
      setEditedeyewearConfig,
      setEditedaxisConfig,
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
                id: "id",
                desc: false,
              },
            ],
          },
        },
        useSortBy,
        useRowSelect
      );

    const statusArray = [
      { name: "selected", value: "selected" },
      { name: "available", value: "available" },
      { name: "missing", value: "missing" },
      { name: "dispensed", value: "dispensed" },
      { name: "trashed", value: "trashed" },
    ];

    const CellRenderer = ({
      cell,
      row,
      selectOptions,
      setNewRow,
      tableType,
    }) => {
      return (
        <td {...cell.getCellProps()}>
          {cell.column.id !== "action" &&
            (cell.column.id === "NewValue" ||
            cell.column.id === "NewAxisMin" ||
            cell.column.id === "NewAxisMax" ? (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updatedData = [...data];
                  const rowIndex = row.index;
                  const columnId = cell.column.id;

                  updatedData[rowIndex][columnId] = e.target.innerHTML;

                  const newContent = e.target.innerHTML;
                  const originalContent = cell.value;

                  // Check if the content has changed
                  if (newContent !== originalContent) {
                    if (tableType === "eyewearConfig") {
                      setEditedeyewearConfig((state) => {
                        const newState = [...state];
                        newState[rowIndex] = updatedData[rowIndex];
                        return newState;
                      });
                    }

                    if (tableType === "axisConfig") {
                      setEditedaxisConfig((state) => {
                        const newState = [...state];
                        newState[rowIndex] = updatedData[rowIndex];
                        return newState;
                      });
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: cell.value }}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: cell.value }} />
            ))}
        </td>
      );
    };

    const setNewRow = (columnId, value) => {
      setNewRowData((prevRow) => ({ ...prevRow, [columnId]: value }));
    };

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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) =>
                  // Conditionally render cells based on column id
                  cell.column.id !== "action" ? (
                    <CellRenderer
                      tableType={tableType}
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
