import axiosInstance from "./axios";

export const getUserStats = async () => {
    const response = await axiosInstance.get("/users/stats");
    return response.data;
};
