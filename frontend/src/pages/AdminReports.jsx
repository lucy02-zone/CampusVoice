import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import { getReports } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

const AdminReports = () => {
    const { token } = useAuth();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await getReports(token);

                if (data.success) {
                    setReports(data.reports);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load reports"
                );
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, [token]);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Reported Posts
                </Typography>

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 5,
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

                {!loading &&
                    !error &&
                    reports.length === 0 && (
                        <Alert severity="info">
                            No reports available.
                        </Alert>
                    )}

                {!loading &&
                    !error &&
                    reports.map((report) => (
                        <Card key={report.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Report #{report.id}
                                </Typography>

                                <Typography>
                                    Post ID: {report.postId}
                                </Typography>

                                <Typography>
                                    Reason: {report.reason}
                                </Typography>

                                <Typography sx={{ mt: 1 }}>
                                    Description:{" "}
                                    {report.description || "No description"}
                                </Typography>

                                <Chip
                                    label={report.status}
                                    sx={{ mt: 2 }}
                                />
                            </CardContent>
                        </Card>
                    ))}
            </Box>
        </Container>
    );
};

export default AdminReports;