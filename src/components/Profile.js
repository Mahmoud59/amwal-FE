import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [floatValue, setFloatValue] = useState(0.0);
  const [dateTimeValue, setDateTimeValue] = useState(new Date());
  const [message, setMessage] = useState('');

  const userData = JSON.parse(localStorage.getItem('user'));
  console.log(userData);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/foods/?limit=10000')
      .then(response => setDropdownOptions(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleDropdownChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleFloatChange = event => {
    setFloatValue(parseFloat(event.target.value));
  };

  const handleDateTimeChange = event => {
    setDateTimeValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:8000/api/v1/users/73707eab-068e-4183-9fcc-ee5a9cbbec11/foods/', {
      food: selectedOption,
      calorie_value: floatValue,
      dose_time: dateTimeValue
    })
    .then(response => {
      toast.success('Form submitted successfully!', { autoClose: 2000 });
    })
    .catch(error => {
      try{
        if (error.response.data) {
          if (typeof(error.response.data) == 'object'){
            var errorMessage = error.response.data.message
          } else {
            for (const key in error.response.data) {
              if (error.response.data.hasOwnProperty(key)) {
                var errorMessage = error.response.data[key][0]
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

  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dropdown">Dropdown:</label>
        <select id="dropdown" value={selectedOption} onChange={handleDropdownChange}>
          <option value="">Select an option</option>
          {dropdownOptions['results'] ? dropdownOptions['results'].map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          )) : null}
        </select>

        <label htmlFor="float">Calorie value:</label>
        <input id="float" type="number" step="0.01" value={floatValue} onChange={handleFloatChange} />

        <label htmlFor="datetime">Dose Time:</label>
        <input id="datetime" type="datetime-local" value={dateTimeValue} onChange={handleDateTimeChange} />

        <button className="btn btn-primary btn-block">
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
