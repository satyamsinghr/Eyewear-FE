
import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { useTable, useRowSelect, useSortBy } from 'react-table';

const ReactTable = forwardRef(({ columns, data, handleSubmit, selectOptions }, ref) => {

    const [newRowData, setNewRowData] = useState(() => {
        const initialRow = {};
        columns.forEach(async (column) => {
            if (column.accessor != 'action') {
                initialRow[column.accessor] = '';
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
            if (column.accessor != 'action') {
                initialRow[column.accessor] = '';
            }
        });
        setNewRowData(initialRow);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'id', // default sorting column
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
                {cell.column.id !== 'action' ? (
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


    return (
        <table {...getTableProps()} style={{ width: '100%' }}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                <tr>
                    {columns.map((column, columnIndex) => (
                        // Check if the current column is not the action column
                        columnIndex !== columns.length - 1 && (
                            <td key={column.accessor}>

                                {
                                    column.accessor === "Col_type" ?
                                        <select
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="Lens Type"
                                            onChange={(e) => setNewRow(column.accessor, e.target.value)}
                                            value={newRowData[column.accessor]}
                                            defaultValue=""
                                        >
                                            <option disabled selected value="">Select a Name</option>
                                            {
                                                selectOptions.map((val, index) => {
                                                    return (
                                                        <option value={val.id}>{val.Coll_name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        :

                                    // column.accessor === "Lens_Status" ?
                                    //     <select
                                    //         className="form-control"
                                    //         id="floatingInput"
                                    //         placeholder="Lens Type"
                                    //         onChange={(e) => setNewRow(column.accessor, e.target.value)}
                                    //         value={newRowData[column.accessor]}
                                    //         defaultValue=""
                                    //     >
                                    //         <option disabled selected value="">Select a Name</option>
                                    //         {
                                    //             selectOptions.map((val, index) => {
                                    //                 return (
                                    //                     <option value={val.id}>{val.Coll_name}</option>
                                    //                 );
                                    //             })
                                    //         }
                                    //     </select>

                                    // :

                                    <input
                                        type={(column.accessor === "Coll_date" || column.accessor === "Box_date") ? "date" : "text"}
                                        value={newRowData[column.accessor]}
                                        onChange={(e) => setNewRow(column.accessor, e.target.value)}
                                    />
                                }

                            </td>
                        )
                    ))}
                    <td>
                        {/* Render the Save button for the new row */}
                        <button className="btn btn-primary me-3 w-100" onClick={(e) => handleSubmit(e, newRowData)}>Save</button>
                    </td>
                </tr>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                // Conditionally render cells based on column id
                                cell.column.id !== 'action' ? (
                                    <CellRenderer
                                        cell={cell}
                                        value={cell.render('Cell')}
                                        row={row}
                                        key={cell.getCellProps().key}
                                    />
                                ) : (
                                    <td {...cell.getCellProps()}>
                                        {cell.column.render('Cell', { row })} {/* Pass the row to the render function */}
                                    </td>
                                )
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});

export default ReactTable;









