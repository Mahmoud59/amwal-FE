import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import { Table } from 'react-bootstrap';
import './../../assests/css/table.css';
import './../../assests/css/button.css';


function UserFoodList() {
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));          
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  const { id } = useParams();

  const headers = {
    headers: { Authorization: `Bearer ${userData['access']}` }
  };

  const handleAddNewDoseClick = () => {
    navigate("/user/food/create");
  };

  const handleShowMaxDayClick = () => {
     navigate(`/user/food/limits`);
  };

  const handleEditClick = (dose) => {
    navigate(`/user/food/update/${dose.id}/`);
  };

  useEffect((userUUID) => {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${id}/foods/?limit=${pageSize}`, headers)
      .then(response => setData(response.data['results']))
      .catch(error => console.log(error))
  }, []);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const dataSubset = data.slice(startIndex, endIndex);
  const doseTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  return (
    <div>
      <button className="my-button" onClick={() => handleAddNewDoseClick()}>Add New Dose</button>
      <button className="my-button" onClick={() => handleShowMaxDayClick()}>Show Max Day</button>
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
          {data.map(dose => (
            <tr key={dose.id}>
              <td>{dose.id}</td>
              <td>{dose.meal}</td>
              <td>{dose.food.name}</td>
              <td>{dose.calorie_value}</td>
              <td>{new Date(dose.dose_time).toLocaleDateString('en-US', doseTimeOptions)}</td>
              <td>
              <button onClick={() => handleEditClick(dose)}>Edit</button>
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserFoodList;
