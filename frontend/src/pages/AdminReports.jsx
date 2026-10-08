import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import { getReports } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const AdminReports = () => {
    const { token } = useAuth();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            setError("");
            try {
                const data = await getReports(token);

                if (data.success) {
                    setReports(data.reports);
                }
            } catch (error) {
                setError(
                    getApiErrorMessage(error, "Failed to load reports")
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadReports();
        }
    }, [token]);

    const getStatusChipColor = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "warning";
            case "RESOLVED":
                return "success";
            case "REJECTED":
            case "DISMISSED":
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
                    Reported Posts Admin
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

                {!loading && !error && reports.length === 0 && (
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
                            No reports available.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            There are currently no reported posts to review.
                        </Typography>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    reports.map((report) => (
                        <Card key={report.id} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                                        Report #{report.id}
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Chip
                                            label={report.reason}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Chip
                                            label={report.status || "PENDING"}
                                            color={getStatusChipColor(report.status || "PENDING")}
                                            size="small"
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 2, color: "text.secondary" }}>
                                    <Typography variant="body2" gutterBottom>
                                        Target Post ID: <strong>{report.postId}</strong>
                                    </Typography>

                                    {report.createdAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            Reported on: {formatDate(report.createdAt)}
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Typography variant="body2" sx={{ mt: 1.5, color: "text.primary" }}>
                                    <strong>Description:</strong>{" "}
                                    {report.description || "No detailed description provided."}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    component={Link}
                                    to={`/posts/${report.postId}`}
                                >
                                    View Post #{report.postId}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
            </Box>
        </Container>
    );
};

export default AdminReports;