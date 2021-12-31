import axios from "axios";

// baseURL is location of BACKEND server

export default axios.create({
    baseURL: "http://localhost:5000/api/v1/restaurants",
    headers: {
        "Content-type": "application/json"
    }
});