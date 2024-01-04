

import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { useTable, useRowSelect, useSortBy } from 'react-table';

const InlineEditingTable = forwardRef(({ columns, data, handleSubmit,role }, ref) => {
    console.log('table data', data);
    const columnName = ['PatientId', 'PercentageS', 'PercentageB','RSphere', 'RCylinder', 'RAxis', 'RAdd', 'LSphere', 'LCylinder', 'LAxis', 'LAdd', 'Lens_Status'];

    const [newRowData, setNewRowData] = useState(() => {
        const initialRow = {};
        columnName.forEach(async (column) => {
            // if (column.accessor != 'action') {
            //     initialRow[column.accessor] = '';
            // }
            if(column === 'Lens_Status'){
                initialRow[column] = 'Patient';
            }
            else{
                initialRow[column] = '';
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
        const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        uniqueString = Array.from({ length: 6 }, () => alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]).join('');
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
            if(column === 'Lens_Status'){
                initialRow[column] = 'Patient';
            }
            else{
                initialRow[column] = '';
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
    console.log('rows', rows)
    return (
        <table {...getTableProps()} style={{ width: '100%' }} className='patitnet_table'>
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

            {parseInt(role) !== 1  && ( 
                <tr>
                    {columnName.map((column, columnIndex) =>
                        (
                            // Check if the current column is not the action column
                            // columnIndex !== columnName.length - 1 && (
                            <td key={column}>
                                {/* Render input field for the new row */}
                                <input
                                    type="text"
                                    value={newRowData[column]}
                                    onChange={(e) => setNewRow(column, e.target.value)}
                                    disabled = {(column == "PercentageS" || column == "PercentageB") ? true : false}
                                />
                            </td>
                            // )
                        )
                     )}
                    <td></td>
                    <td></td>
                    <td>
                        <button className="btn btn-primary me-3 w-100" onClick={(e) => handleSubmit(e, newRowData)}>Save & Serach</button>
                    </td>
                </tr>
                 )}
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

export default InlineEditingTable;
