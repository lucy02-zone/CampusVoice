import api from "./axios";
import { authHeaders } from "./apiHelpers";

export const votePost = async (voteData, token) => {
    const response = await api.post(
        "/votes",
        voteData,
        {
            headers: authHeaders(token),
        }
    );

    return response.data;
};