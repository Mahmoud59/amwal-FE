import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const FoodForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const userData = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const headers = {
      headers: { Authorization: `Bearer ${userData['access']}` }
  };

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/v1/foods/${id}/`, headers)
        .then(res => {
          setName(res.data.name);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setCreating(true);
    }
  }, [id]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/api/v1/foods/${id}/`, { name }, headers)
      .then(res => {
         navigate("/foods/list");
      })
      .catch(err => {
        console.log(err);
      });
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/v1/foods/', { name }, headers)
      .then(res => {
         navigate("/foods/list");
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div>
      {creating ? (
        <div>
          <h2>Create Food</h2>
          <form onSubmit={handleCreateSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Create</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Edit Food</h2>
          <form onSubmit={handleEditSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default FoodForm;
