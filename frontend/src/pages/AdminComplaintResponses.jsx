import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import { getComplaintResponses } from "../api/complaintResponseApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const AdminComplaintResponses = () => {
    const { token } = useAuth();

    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadResponses = async () => {
            setError("");
            try {
                const data = await getComplaintResponses(token);

                if (data.success) {
                    setResponses(data.responses);
                }
            } catch (error) {
                setError(
                    getApiErrorMessage(
                        error,
                        "Failed to load complaint responses"
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadResponses();
        }
    }, [token]);

    const getStatusChipColor = (status) => {
        switch (status?.toUpperCase()) {
            case "RESOLVED":
            case "COMPLETED":
            case "ANSWERED":
                return "success";
            case "PENDING":
            case "IN_PROGRESS":
                return "warning";
            case "REJECTED":
            case "CLOSED":
                return "error";
            default:
                return "default";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Complaint Responses Admin
                </Typography>

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            my: 5,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && responses.length === 0 && (
                    <Paper
                        sx={{
                            p: 5,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No complaint responses available.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            There are currently no recorded complaint responses to review.
                        </Typography>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    responses.map((item) => (
                        <Card key={item.id} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                                        Complaint #{item.complaintId}
                                    </Typography>

                                    {item.status && (
                                        <Chip
                                            label={item.status}
                                            color={getStatusChipColor(item.status)}
                                            size="small"
                                        />
                                    )}
                                </Box>

                                {item.createdAt && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{ mb: 2 }}
                                    >
                                        Responded on: {formatDate(item.createdAt)}
                                    </Typography>
                                )}

                                <Divider sx={{ my: 1.5 }} />

                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.6,
                                        whiteSpace: "pre-line",
                                        color: "text.primary",
                                    }}
                                >
                                    {item.response}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
            </Box>
        </Container>
    );
};

export default AdminComplaintResponses;