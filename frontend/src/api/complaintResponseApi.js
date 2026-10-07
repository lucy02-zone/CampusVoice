import api from "./axios";

export const createComplaintResponse = async (data, token) => {
    const response = await api.post("/complaint-responses", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getComplaintResponses = async (token) => {
    const response = await api.get("/complaint-responses", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};