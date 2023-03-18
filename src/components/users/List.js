import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Table } from 'react-bootstrap';
import './../../assests/css/pagination.css';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const headers = {
      headers: { Authorization: `Bearer ${userData['access']}` }
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/users/?limit=10000`, headers)
      .then(response => {
        setUsers(response.data['results']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleEdit(user) {
    navigate(`/users/update/${user.id}/`);
  }

  function handleDelete(user) {
    const updatedData = users.filter(item => item.id !== user.id);;
    setUsers(updatedData);
  
    axios.delete(`http://127.0.0.1:8000/api/v1/users/${user.uuid}/`, headers)
        .then(response => {
        toast.success('user is deleted successfully!', { autoClose: 2000 });
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

  const handleAddNewUserClick = () => {
    navigate("/users/create");
  };

  const handleUserCalories = (user) => {
    navigate(`/user/food/list/${user.uuid}/`);
  };

  const renderTableData = () => {
    return users.map((user, index) => {
      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{user.user.first_name} {user.user.last_name}</td>
          <td>
            <button onClick={() => handleUserCalories(user)}>Show Calories History</button>
          </td>
        </tr>
      );
    });
  }


  return (
    <div>
      <h1>User List</h1>
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

export default UserList;
