import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";

import {
    getNotifications,
    markNotificationAsRead,
} from "../api/notificationApi";

import { useAuth } from "../context/AuthContext";

const Notifications = () => {
    const { token } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            const data = await getNotifications(token);

            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id, token);
            loadNotifications();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update notification"
            );
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Notifications
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {notifications.length === 0 ? (
                    <Alert severity="info">
                        No notifications.
                    </Alert>
                ) : (
                    notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            sx={{ mb: 2 }}
                        >
                            <CardContent>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {notification.message}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Status:{" "}
                                    {notification.isRead
                                        ? "Read"
                                        : "Unread"}
                                </Typography>

                                {!notification.isRead && (
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                    >
                                        Mark as Read
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default Notifications;