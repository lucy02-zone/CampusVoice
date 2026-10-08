import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const createComplaintResponse = async (data, token) => {
    const response = await api.post(
        "/complaint-responses",
        data,
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};

export const getComplaintResponses = async (token) => {
    const response = await api.get(
        "/complaint-responses",
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};