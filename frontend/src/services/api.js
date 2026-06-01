import axios from "axios";

const API = axios.create({
  baseURL: "https://knowledge-based-faq-generator.onrender.com",
});

export default API;