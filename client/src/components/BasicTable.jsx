import React, { useEffect, useMemo, useState } from 'react'
import { useTable,usePagination } from 'react-table'
import { COLUMNS } from './columns'
import axios from 'axios'
import './table.css'


export const BasicTable = ({}) => {
  const [contacts, setContacts] = useState([])
 

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      let response = await axios.get('http://localhost:5000/v1/all-contacts') // Replace with your API endpoint
      setContacts(response.data.msg)
    } catch (error) {
      console.log(error)
    }
  }
  const columns = useMemo(() => COLUMNS, [])
  const data = contacts

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canNextPage,
    canPreviousPage,
    nextPage,
    pageOptions,
    previousPage,
    setPageSize,
    state,
    prepareRow,
  } = useTable({
    columns,
    data,
  },usePagination)

  const{pageSize,pageIndex}=state
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
       
      </table>
      <div>
        <select value={pageSize} onChange={(e)=>setPageSize(e.target.value)}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span>Page{' '} <strong>{pageIndex+1} of {pageOptions.length}</strong></span>
        <button onClick={()=>previousPage()} disabled={!canPreviousPage}>Prev</button>
        <button onClick={()=>nextPage()} disabled={!canNextPage}>Next</button>
      </div>
    </>
  )
}
