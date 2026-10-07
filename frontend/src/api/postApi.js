import api from "./axios";

export const getPosts = async () => {
    const response = await api.get("/posts");
    return response.data;
};

export const createPost = async (postData, token) => {
    const response = await api.post("/posts", postData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};