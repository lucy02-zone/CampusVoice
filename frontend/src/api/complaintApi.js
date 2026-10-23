import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const createComplaint = async (data, token) => {
    const response = await api.post("/complaints", data, { headers: authHeaders(token) });
    return response.data;
};

export const getComplaints = async (token) => {
    const response = await api.get("/complaints", { headers: authHeaders(token) });
    return response.data;
};
