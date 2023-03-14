import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './../../assests/css/table.css';
import jwt_decode from 'jwt-decode';
import ReactPaginate from 'react-paginate';

function TableComponent() {
  const [data, setData] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));          
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  
  const headers = {
    headers: { Authorization: `Bearer ${userData['access']}` }
  };
  const decodedAccessKey = jwt_decode(userData['access']);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${decodedAccessKey['uuid']}/foods/`, headers)
      .then(response => setData(response.data['results']))
      .catch(error => console.log(error))
  }, []);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const dataSubset = data.slice(startIndex, endIndex);

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Meal</th>
            <th>Food</th>
            <th>Calorie Value</th>
            <th>Dose Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.meal}</td>
              <td>{item.food}</td>
              <td>{item.calorie_value}</td>
              <td>{item.dose_time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(data.length / pageSize)}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default TableComponent;
