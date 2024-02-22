import axios from 'axios';
import {BASE_URL} from "@/configs/server.config";

const API = axios.create({
    baseURL: `${BASE_URL}/api`
});

const setAuthToken = (token:string) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

const setContentType = (type:string) => {
    API.defaults.headers.common['Content-Type'] = type || 'application/json';
}

export { API, setAuthToken, setContentType };
