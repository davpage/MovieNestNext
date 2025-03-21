import {backUrl} from "@/lib/url";
import axios from "axios";
const api = async (path, options) => {
    const { method = 'get', data = null, headers = {} } = options || {};
    const defaultHeaders = {
        'Content-Type': 'multipart/form-data',
    };
    const requestParams = {
        url: `${backUrl}${path}`, // Ensure backUrl is properly loaded
        method,
        data,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
    };

    if (method === 'get') {
        delete requestParams.data; // Avoid sending 'data' with GET requests
    }

    try {
        const response = await axios(requestParams);
        return response.data; // Return the actual response data
    } catch (error) {
        throw error; // Properly propagate errors
    }
};

export default api;
