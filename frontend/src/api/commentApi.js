import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const getCommentsByPost = async (postId) => {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
};

export const createComment = async (commentData, token) => {
    const response = await api.post(
        "/comments",
        commentData,
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};