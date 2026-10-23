import axiosInstance from "./axios";

export const getUserStats = async () => {
    const response = await axiosInstance.get("/users/stats");
    return response.data;
};

export const createMentor = async (mentorData) => {
    const response = await axiosInstance.post("/users/mentors", mentorData);
    return response.data;
};

export const getMentors = async () => {
    const response = await axiosInstance.get("/users/mentors");
    return response.data;
};
