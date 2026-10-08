import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import { getPosts } from "../api/postApi";
import { getNotifications } from "../api/notificationApi";
import { getReports } from "../api/reportApi";
import { getComplaintResponses } from "../api/complaintResponseApi";
import { getUserStats } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const Dashboard = () => {
    const { user, token } = useAuth();

    const [stats, setStats] = useState({
        totalPosts: 0,
        totalCategories: 0,
        totalNotifications: 0,
        unreadNotifications: 0,
        totalReports: 0,
        pendingReports: 0,
        totalResponses: 0,
        userActivity: {
            postsCount: 0,
            commentsCount: 0,
            votesGiven: 0,
            reputation: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isMentor = user?.role === "MENTOR";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError("");

            try {
                // Fetch posts statistics
                const postsRes = await getPosts();
                const postsList = postsRes.success ? postsRes.posts : [];
                const categoriesSet = new Set(
                    postsList.map((p) => p.category).filter(Boolean)
                );

                // Fetch notifications statistics
                let notifsList = [];
                if (token) {
                    const notifRes = await getNotifications(token);
                    if (notifRes.success) {
                        notifsList = notifRes.notifications;
                    }
                }

                // Fetch Mentor statistics if user is a MENTOR
                let reportsList = [];
                let responsesList = [];
                if (isMentor && token) {
                    try {
                        const repRes = await getReports(token);
                        if (repRes.success) reportsList = repRes.reports;

                        const compRes = await getComplaintResponses(token);
                        if (compRes.success) responsesList = compRes.responses;
                    } catch {
                        // ignore secondary mentor fetch error
                    }
                }

                // Fetch User Stats
                let userStatsRes = {};
                if (token) {
                    try {
                        userStatsRes = await getUserStats();
                    } catch (e) {
                        console.error("Failed to fetch user stats", e);
                    }
                }

                setStats({
                    totalPosts: postsList.length,
                    totalCategories: categoriesSet.size,
                    totalNotifications: notifsList.length,
                    unreadNotifications: notifsList.filter((n) => !n.isRead).length,
                    totalReports: reportsList.length,
                    pendingReports: reportsList.filter(
                        (r) => (r.status || "PENDING").toUpperCase() === "PENDING"
                    ).length,
                    totalResponses: responsesList.length,
                    userActivity: userStatsRes.success ? userStatsRes.stats : stats.userActivity,
                });
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load dashboard data"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, isMentor]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 5, mb: 5 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    User Dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* User Information Card */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                        color: "white",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            flexWrap: "wrap",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: "white",
                                color: "primary.main",
                                fontWeight: 700,
                                fontSize: "1.5rem",
                            }}
                        >
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {user?.name || "Campus User"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {user?.email}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
                                Anonymous ID: <strong>ANON-{user?.id}</strong>
                            </Typography>
                        </Box>

                        <Chip
                            label={user?.role || "STUDENT"}
                            color={isMentor ? "secondary" : "default"}
                            sx={{
                                bgcolor: "white",
                                color: isMentor ? "secondary.main" : "primary.main",
                                fontWeight: 700,
                            }}
                        />
                    </Box>
                </Paper>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            my: 6,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Overview & Statistics
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Total Campus Posts
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "primary.main" }}>
                                            {stats.totalPosts}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Active Categories
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "info.main" }}>
                                            {stats.totalCategories}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Notifications
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "success.main" }}>
                                            {stats.totalNotifications}
                                        </Typography>
                                        {stats.unreadNotifications > 0 && (
                                            <Typography variant="caption" color="warning.main">
                                                {stats.unreadNotifications} unread
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {isMentor && (
                                <>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Reported Posts
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "error.main" }}>
                                                    {stats.totalReports}
                                                </Typography>
                                                {stats.pendingReports > 0 && (
                                                    <Typography variant="caption" color="error.main">
                                                        {stats.pendingReports} pending
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Complaint Responses
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "secondary.main" }}>
                                                    {stats.totalResponses}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            My Activity
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            My Posts
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "primary.main" }}>
                                            {stats.userActivity.postsCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            My Comments
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "info.main" }}>
                                            {stats.userActivity.commentsCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Votes Given
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "secondary.main" }}>
                                            {stats.userActivity.votesGiven}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            My Reputation
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: "success.main" }}>
                                            {stats.userActivity.reputation}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={1}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <Button variant="contained" component={Link} to="/posts">
                                    View Posts
                                </Button>
                                <Button variant="outlined" component={Link} to="/create-post">
                                    Create Post
                                </Button>
                                <Button variant="outlined" component={Link} to="/notifications">
                                    View Notifications ({stats.unreadNotifications})
                                </Button>
                                {isMentor && (
                                    <>
                                        <Button variant="outlined" color="error" component={Link} to="/admin/reports">
                                            Admin Reports
                                        </Button>
                                        <Button variant="outlined" color="secondary" component={Link} to="/admin/complaint-responses">
                                            Admin Complaints
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;
