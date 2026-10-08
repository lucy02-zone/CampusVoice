import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const getPosts = async () => {
    const response = await api.get("/posts");
    return response.data;
};

export const createPost = async (postData, token) => {
    const response = await api.post(
        "/posts",
        postData,
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};