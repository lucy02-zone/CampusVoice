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
        <Container maxWidth="md">
            <Box sx={{ mt: 5, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Notifications
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

                {!loading && !error && notifications.length === 0 && (
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
                            No notifications yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We'll notify you when there are updates on your campus posts or activity.
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
                                sx={{
                                    mb: 2,
                                    boxShadow: isUnread ? 3 : 1,
                                    borderRadius: 2,
                                    borderLeft: isUnread
                                        ? "4px solid #1976d2"
                                        : "4px solid transparent",
                                    bgcolor: isUnread
                                        ? "action.hover"
                                        : "background.paper",
                                }}
                            >
                                <CardContent>
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
                                                fontWeight: isUnread ? 600 : 400,
                                                flexGrow: 1,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>

                                        <Chip
                                            label={isUnread ? "Unread" : "Read"}
                                            color={isUnread ? "primary" : "default"}
                                            size="small"
                                            variant={isUnread ? "filled" : "outlined"}
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
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {formatDate(notification.createdAt)}
                                        </Typography>

                                        {isUnread && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={isUpdatingThis}
                                                onClick={() =>
                                                    handleMarkAsRead(notification.id)
                                                }
                                                startIcon={
                                                    isUpdatingThis ? (
                                                        <CircularProgress
                                                            size={14}
                                                            color="inherit"
                                                        />
                                                    ) : null
                                                }
                                            >
                                                {isUpdatingThis
                                                    ? "Updating..."
                                                    : "Mark as Read"}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
            </Box>
        </Container>
    );
};

export default Notifications;