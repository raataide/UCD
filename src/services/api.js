import axios from "axios";

const api = axios.create({
  baseURL: "http://www.ucdpatologia.com.br:3000/",
});

export default api;
