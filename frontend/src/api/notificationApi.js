import api from "./axios";

export const getNotifications = async (token) => {
    const response = await api.get("/notifications", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const markNotificationAsRead = async (id, token) => {
    const response = await api.patch(
        `/notifications/${id}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};