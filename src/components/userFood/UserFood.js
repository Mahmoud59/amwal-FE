import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import './../../assests/css/pagination.css';


const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const headers = {
      headers: { Authorization: `Bearer ${userData['access']}` }
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/foods/?limit=10000`, headers)
      .then(response => {
        setFoods(response.data['results']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleEdit(food) {
    navigate(`/foods/update/${food.id}/`);
  }

  function handleDelete(food) {
    const updatedData = foods.filter(item => item.id !== food.id);;
    setFoods(updatedData);
  
    axios.delete(`http://127.0.0.1:8000/api/v1/foods/${food.id}/`, headers)
    .then(response => {
      toast.success('Food is deleted successfully!', { autoClose: 2000 });
    })
    .catch(error => {
      try{
        if (error.response.data) {
          if (typeof(error.response.data) == 'object' && error.response.data.message){
            var errorMessage = error.response.data.message
          } else {
            for (const key in error.response.data) {
              if (error.response.data.hasOwnProperty(key)) {
                var errorMessage = `${key}: ${error.response.data[key][0]}`
              }
            }
          }
          } else {
            var errorMessage = error.response.data.detail
          }
      } catch(catch_error){
        var errorMessage = "Failed, please check again."
      }
      toast.error(errorMessage, { autoClose: 2000 });
    });
  }

  const handleAddNewFoodClick = () => {
    navigate("/foods/create");
  };

  const renderTableData = () => {
    return foods.map((food, index) => {
      return (
        <tr key={index}>
          <td>{food.id}</td>
          <td>{food.name}</td>
          <td>
            <button onClick={() => handleEdit(food)}>Edit</button>
            <button onClick={() => handleDelete(food)}>Delete</button>
          </td>
        </tr>
      );
    });
  }


  return (
    <div>
      <button className="my-button" onClick={() => handleAddNewFoodClick()}>Add new food</button>
      <h1>Food List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </Table>
    </div>
  );
};

export default FoodList;
