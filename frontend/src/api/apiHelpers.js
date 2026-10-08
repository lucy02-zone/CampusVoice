export const authHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
    };
};