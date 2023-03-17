import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './../../assests/css/table.css';
import './../../assests/css/button.css';
import jwt_decode from 'jwt-decode';
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";

function TableComponent() {
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));          
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingIndex, setEditingIndex] = useState(-1);

  const headers = {
    headers: { Authorization: `Bearer ${userData['access']}` }
  };
  const decodedAccessKey = jwt_decode(userData['access']);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddNewDoseClick = () => {
    navigate("/user/food");
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${decodedAccessKey['uuid']}/foods/?limit=${pageSize}`, headers)
      .then(response => setData(response.data['results']))
      .catch(error => console.log(error))
  }, []);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const dataSubset = data.slice(startIndex, endIndex);
  const doseTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  return (
    <div>
      <button className="my-button" onClick={() => handleAddNewDoseClick()}>Add new dose</button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Meal</th>
            <th>Food</th>
            <th>Calorie Value</th>
            <th>Dose Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.meal}</td>
              <td>{item.food.name}</td>
              <td>{item.calorie_value}</td>
              <td>{new Date(item.dose_time).toLocaleDateString('en-US', doseTimeOptions)}</td>
              <td>
              <button onClick={() => handleEditClick(item.id)}>Edit</button>
            </td>
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
