import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { Table } from 'react-bootstrap';


const UserFoodLimit = () => {
    const [data, setData] = useState([]);
    const userData = JSON.parse(localStorage.getItem('user'));
    const doseTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let [rowNum] = useState(1);
    const {id} = useState();
    const headers = {
        headers: { Authorization: `Bearer ${userData['access']}` }
    };
    const decodedAccessKey = jwt_decode(userData['access']);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${decodedAccessKey['uuid']}/foods/limits/`, headers)
        .then(response => setData(response.data))
        .catch(error => console.log(error))
    }, []);


  return (
    <div>
      <h1>Max day calories</h1>
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
              <td>{rowNum++}</td>
              <td>{item.meal}</td>
              <td>{item.food.name}</td>
              <td>{item.calorie_value}</td>
              <td>{new Date(item.dose_time).toLocaleDateString('en-US', doseTimeOptions)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserFoodLimit;
