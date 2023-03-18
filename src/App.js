import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import EventBus from "./common/EventBus";

import Login from "./components/users/Login";
import Home from "./components/users/Home";
import CreateUserFood from "./components/userFood/CreateForm";
import UserList from './components/users/List';
import FoodList from './components/foods/List';
import CreateFoodForm from './components/foods/Form';
import UpdateFoodForm from './components/foods/Form';
import UserFoodLimit from './components/userFood/UserFoodLimit';
import UpdateUserFood from './components/userFood/UpdateForm';
import UserFoodList from './components/userFood/List';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [homeURL, sethomeURL] = useState("/");
  const [userType, setuserType] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      const decodedAccessKey = jwt_decode(user['access']);
      setCurrentUser(user);
      if (decodedAccessKey['user_type'] == 'admin'){
        sethomeURL('/foods/list');
        setuserType('admin')
      }
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    sethomeURL(undefined);
  };


  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={homeURL} className="navbar-brand">
          Home
        </Link>
        <div className="navbar-nav mr-auto">

          {userType == 'admin' && (
            <li className="nav-item">
              <Link to={"/users"} className="nav-link">
                Users
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/foods/list" element={<FoodList />} />
          <Route exact path="/foods/create" element={<CreateFoodForm />} />
          <Route exact path="/foods/update/:id" element={<UpdateFoodForm />} />
          <Route exact path="/users" element={<UserList />} />
          <Route exact path="/user/food/list/:id" element={<UserFoodList />} />
          <Route exact path="/user/food/create" element={<CreateUserFood />} />
          <Route exact path="/user/food/update/:id" element={<UpdateUserFood />} />
          <Route exact path="/user/food/limits" element={<UserFoodLimit />} />
       </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
