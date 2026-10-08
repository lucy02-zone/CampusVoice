import { useEffect, useState } from "react";
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
        <div>
            <h1>Notifications</h1>

            {error && <p>{error}</p>}

            {notifications.length === 0 ? (
                <p>No notifications.</p>
            ) : (
                notifications.map((notification) => (
                    <div key={notification.id}>
                        <p>{notification.message}</p>

                        <p>
                            Status:{" "}
                            {notification.isRead ? "Read" : "Unread"}
                        </p>

                        {!notification.isRead && (
                            <button
                                onClick={() =>
                                    handleMarkAsRead(notification.id)
                                }
                            >
                                Mark as Read
                            </button>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;