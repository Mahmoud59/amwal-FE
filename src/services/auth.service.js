import axios from "axios";

const USER_API_URL = "http://127.0.0.1:8000/api/v1/users/";

const login = (username, password) => {
  return axios
    .post(USER_API_URL + "login/", {
      username,
      password,
    })
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
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
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
