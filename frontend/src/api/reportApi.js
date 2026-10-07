import api from "./axios";

export const createReport = async (reportData, token) => {
    const response = await api.post("/reports", reportData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getReports = async (token) => {
    const response = await api.get("/reports", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};