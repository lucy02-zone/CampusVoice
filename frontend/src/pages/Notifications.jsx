import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import {
    getNotifications,
    markNotificationAsRead,
} from "../api/notificationApi";

import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const Notifications = () => {
    const { token } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        setError("");
        try {
            const data = await getNotifications(token);

            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load notifications"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadNotifications();
        }
    }, [token]);

    const handleMarkAsRead = async (id) => {
        setError("");
        setUpdatingId(id);
        try {
            await markNotificationAsRead(id, token);
            await loadNotifications();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update notification"));
        } finally {
            setUpdatingId(null);
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
                        Notifications
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
                        Updates on your campus activity, responses, and reports.
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

                {!loading && !error && notifications.length === 0 && (
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
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            No notifications yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                            We'll notify you here whenever there are updates on your campus posts.
                        </Typography>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    notifications.map((notification) => {
                        const isUnread = !notification.isRead;
                        const isUpdatingThis = updatingId === notification.id;

                        return (
                            <Card
                                key={notification.id}
                                elevation={0}
                                sx={{
                                    mb: 2,
                                    border: "1px solid #E2E8F0",
                                    borderRadius: "14px",
                                    bgcolor: isUnread ? "rgba(79, 70, 229, 0.03)" : "#FFFFFF",
                                    borderColor: isUnread ? "rgba(79, 70, 229, 0.25)" : "#E2E8F0",
                                    transition: "all 180ms ease-in-out",
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            mb: 1.5,
                                            gap: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: isUnread ? 700 : 500,
                                                color: isUnread ? "#0F172A" : "#334155",
                                                flexGrow: 1,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>

                                        <Chip
                                            label={isUnread ? "New" : "Read"}
                                            size="small"
                                            sx={{
                                                bgcolor: isUnread ? "rgba(79, 70, 229, 0.12)" : "#F1F5F9",
                                                color: isUnread ? "#4F46E5" : "#64748B",
                                                fontWeight: 700,
                                                borderRadius: "6px",
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mt: 2,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94A3B8" }}>
                                            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                                                {formatDate(notification.createdAt)}
                                            </Typography>
                                        </Box>

                                        {isUnread && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={isUpdatingThis}
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                startIcon={
                                                    isUpdatingThis ? (
                                                        <CircularProgress size={14} color="inherit" />
                                                    ) : (
                                                        <CheckIcon fontSize="small" />
                                                    )
                                                }
                                                sx={{ py: 0.5, px: 1.5, fontSize: "0.75rem" }}
                                            >
                                                {isUpdatingThis ? "Updating..." : "Mark as Read"}
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

export default Notifications;