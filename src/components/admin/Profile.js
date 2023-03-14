import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [mealOptions, setMealOptions] = useState(["Breakfast", "Lunch", "Dinner"]);
  const [selectedMealOption, setSelectedMalOption] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [calorieValue, setCalorieValue] = useState(0.0);
  const [doseDateTime, setDoseDateTime] = useState(new Date());

  const userData = JSON.parse(localStorage.getItem('user'));

  const headers = {
      headers: { Authorization: `Bearer ${userData['access']}` }
  };

  const handleMealOptionChange = (event) => {
    setSelectedMalOption(event.target.value);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/foods/?limit=10000', headers)
      .then(response => setFoodOptions(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleDropdownChange = event => {
    setSelectedFood(event.target.value);
  };

  const handleFloatChange = event => {
    setCalorieValue(parseFloat(event.target.value));
  };

  const handleDateTimeChange = event => {
    setDoseDateTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:8000/api/v1/users/73707eab-068e-4183-9fcc-ee5a9cbbec11/foods/', {
      meal: selectedMealOption,
      food: selectedFood,
      calorie_value: calorieValue,
      dose_time: doseDateTime
    }, headers
    )
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
        <label htmlFor="dropdown">Choose the meal:</label>
        <select value={selectedMealOption} onChange={handleMealOptionChange}>
          {mealOptions.map((meal) => (
            <option value={meal.toLowerCase()} key={meal}>
              {meal}
            </option>
          ))}
        </select>

        <label htmlFor="dropdown">Choose the food:</label>
        <select id="dropdown" value={selectedFood} onChange={handleDropdownChange}>
          {foodOptions['results'] ? foodOptions['results'].map(food => (
            <option key={food.id} value={food.id}>{food.name}</option>
          )) : null}
        </select>

        <label htmlFor="float">Calorie value:</label>
        <input id="float" type="number" step="0.01" value={calorieValue} onChange={handleFloatChange} />

        <label htmlFor="datetime">Dose Time:</label>
        <input id="datetime" type="datetime-local" value={doseDateTime} onChange={handleDateTimeChange} />

        <button className="btn btn-primary btn-block">
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
