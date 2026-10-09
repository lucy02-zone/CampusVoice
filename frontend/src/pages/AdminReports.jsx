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
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

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

    const getStatusChipProps = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return { bgcolor: "rgba(245, 158, 11, 0.12)", color: "#D97706", label: "PENDING REVIEW" };
            case "RESOLVED":
                return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "#059669", label: "RESOLVED" };
            case "REJECTED":
            case "DISMISSED":
                return { bgcolor: "rgba(239, 68, 68, 0.12)", color: "#DC2626", label: "DISMISSED" };
            default:
                return { bgcolor: "#F1F5F9", color: "#64748B", label: status || "UNKNOWN" };
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
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 6 } }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>
                        Content Reports Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
                        Review flagged posts reported by community members.
                    </Typography>
                </Box>

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            py: 8,
                        }}
                    >
                        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && reports.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                            borderRadius: "16px",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <FlagOutlinedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            No reports flagged
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                            There are currently no active content reports requiring mentor action.
                        </Typography>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    reports.map((report) => {
                        const statusProps = getStatusChipProps(report.status);
                        return (
                            <Card
                                key={report.id}
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    border: "1px solid #E2E8F0",
                                    borderRadius: "16px",
                                    bgcolor: "#FFFFFF",
                                    transition: "all 180ms ease-in-out",
                                    "&:hover": {
                                        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                            gap: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={`Reason: ${report.reason}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(239, 68, 68, 0.08)",
                                                    color: "#EF4444",
                                                    fontWeight: 700,
                                                    borderRadius: "6px",
                                                }}
                                            />
                                            {report.postId && (
                                                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                                                    Target Post #{report.postId}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Chip
                                            label={statusProps.label}
                                            size="small"
                                            sx={{
                                                bgcolor: statusProps.bgcolor,
                                                color: statusProps.color,
                                                fontWeight: 700,
                                                borderRadius: "6px",
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ color: "#334155", mb: 2, fontWeight: 500 }}>
                                        {report.description}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94A3B8" }}>
                                            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption">
                                                Reported on {formatDate(report.createdAt)}
                                            </Typography>
                                        </Box>

                                        {report.postId && (
                                            <Button
                                                component={Link}
                                                to={`/posts/${report.postId}`}
                                                variant="outlined"
                                                size="small"
                                                endIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                                            >
                                                Inspect Post
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
            </Container>
        </Box>
    );
};

export default AdminReports;