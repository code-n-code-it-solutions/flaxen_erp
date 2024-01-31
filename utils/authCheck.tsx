import axios from 'axios';
import {API, setAuthToken} from "@/configs/api.config";

export const checkServerSideAuth = async (token:string) => {

    try {
        setAuthToken(token)
        const response = await API.get('/me');
        // console.log(response)
        return !!(response.status === 200 && response.data);
    } catch (error) {
        return false;
    }
};
