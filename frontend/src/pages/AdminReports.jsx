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

import { getReports } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

const AdminReports = () => {
    const { token } = useAuth();

    const [reports, setReports] = useState([]);
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

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {reports.length === 0 ? (
                    <Alert severity="info">
                        No reports available.
                    </Alert>
                ) : (
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
                    ))
                )}
            </Box>
        </Container>
    );
};

export default AdminReports;