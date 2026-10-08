import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const getNotifications = async (token) => {
    const response = await api.get("/notifications", {
        headers: authHeaders(token),
    });

    return response.data;
};

export const markNotificationAsRead = async (id, token) => {
    const response = await api.patch(
        `/notifications/${id}/read`,
        {},
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};