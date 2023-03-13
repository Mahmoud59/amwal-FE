import axios from "axios";

const ADMIMN_API_URL = "http://127.0.0.1:8000/api/v1/users/admins/";
const USER_API_URL = "http://127.0.0.1:8000/api/v1/users/users/";

const register = (username, email, password) => {
  return axios.post(USER_API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(USER_API_URL + "login/", {
      username,
      password,
    })
    .then((response) => {
      // if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
      // }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(USER_API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
