import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Typography,
} from "@mui/material";

import { getComplaintResponses } from "../api/complaintResponseApi";
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
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Complaint Responses
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {responses.length === 0 ? (
                    <Alert severity="info">
                        No complaint responses available.
                    </Alert>
                ) : (
                    responses.map((item) => (
                        <Card key={item.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Complaint #{item.complaintId}
                                </Typography>

                                <Typography sx={{ mb: 2 }}>
                                    {item.response}
                                </Typography>

                                <Chip label={item.status} />
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default AdminComplaintResponses;