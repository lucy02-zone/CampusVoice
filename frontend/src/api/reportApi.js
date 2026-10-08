import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const createReport = async (reportData, token) => {
    const response = await api.post(
        "/reports",
        reportData,
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};

export const getReports = async (token) => {
    const response = await api.get("/reports", {
        headers: authHeaders(token),
    });

    return response.data;
};