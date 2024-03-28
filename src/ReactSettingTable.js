import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTable, useRowSelect, useSortBy, usePagination } from "react-table";

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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
      state,
      canPreviousPage,
      canNextPage,
      pageCount,
      nextPage,
      pageSize,
      setPageSize,
      previousPage, } =
      useTable(
        {
          columns,
          data,
          initialState: {
            pageIndex: 0,
            pageSize: 20,
            sortBy: [
              {
                id: "id",
                desc: false,
              },
            ],
          },
        },
        useSortBy,
        usePagination,
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

    const handlePageSizeChange = size => {
      setPageSize(size);
    };

    return (
      <div>
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
            {rows.slice(state.pageIndex * state.pageSize, (state.pageIndex + 1) * state.pageSize).map((row) => {
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
        <div className="d-flex table_pagination mt-3 align-items-center justify-content-end gap-3">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <button className="pagination_button" onClick={() => previousPage()} disabled={!canPreviousPage}>
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
              {/* Next */}
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
          <div className="m-0">
            <span className="d-inline-block me-2">Page Size :</span>
            <select
              value={pageSize}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
            >
              {[ 20,25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {/* <p>page Size : <select
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select></p> */}
        </div>
      </div>
    );
  }
);

export default ReactTable;
