import axios from 'axios';
import {DEV_API_BASE_URL} from "@/configs/server.config";

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
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
