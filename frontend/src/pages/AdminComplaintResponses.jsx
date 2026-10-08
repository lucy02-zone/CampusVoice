import { useEffect, useState } from "react";
import {
    getComplaintResponses,
} from "../api/complaintResponseApi";
import { useAuth } from "../context/AuthContext";

const AdminComplaintResponses = () => {
    const { token } = useAuth();

    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadResponses = async () => {
            try {
                const data = await getComplaintResponses(token);

                if (data.success) {
                    setResponses(data.responses);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load complaint responses"
                );
            }
        };

        loadResponses();
    }, [token]);

    return (
        <div>
            <h1>Complaint Responses</h1>

            {error && <p>{error}</p>}

            {responses.length === 0 ? (
                <p>No complaint responses available.</p>
            ) : (
                responses.map((item) => (
                    <div key={item.id}>
                        <h3>Complaint #{item.complaintId}</h3>

                        <p>Response: {item.response}</p>

                        <p>Status: {item.status}</p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminComplaintResponses;