import api from "./axios";

export const votePost = async (voteData, token) => {
    const response = await api.post("/votes", voteData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};