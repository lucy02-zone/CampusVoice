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
    Divider,
    useTheme,
} from "@mui/material";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { useAuth } from "../context/AuthContext";
import { getPosts, getPostStats } from "../api/postApi";
import { getNotifications } from "../api/notificationApi";
import { getReports } from "../api/reportApi";
import { getComplaintResponses } from "../api/complaintResponseApi";
import { getUserStats } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const CHART_COLORS = ["#1976d2", "#00bcd4", "#4caf50", "#ff9800", "#f44336", "#9c27b0"];

const TooltipBox = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {label && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
                    {label}
                </Typography>
            )}
            {payload.map((entry, i) => (
                <Typography key={i} variant="body2" sx={{ color: entry.color || "text.primary", fontWeight: 500 }}>
                    {entry.name}: {entry.value}
                </Typography>
            ))}
        </Paper>
    );
};

const StatCard = ({ label, value, color = "primary.main", sub }) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
                borderColor: color,
            },
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 0.5, color: "text.primary" }}>
                {value}
            </Typography>
            {sub ? (
                <Typography variant="caption" sx={{ color: color, fontWeight: 500 }}>
                    {sub}
                </Typography>
            ) : (
                <Typography variant="caption" color="text.disabled">
                    Updated just now
                </Typography>
            )}
        </CardContent>
    </Card>
);

const ChartCard = ({ title, children, height = 300 }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}
    >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "text.primary" }}>
            {title}
        </Typography>
        <Box sx={{ width: "100%", height, flexGrow: 1 }}>
            {children}
        </Box>
    </Paper>
);

const Dashboard = () => {
    const { user, token } = useAuth();
    const theme = useTheme();

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
            upvotesReceived: 0,
            downvotesReceived: 0,
            reputation: 0,
        },
    });

    const [postsPerDay, setPostsPerDay] = useState([]);
    const [categoryDistribution, setCategoryDistribution] = useState([]);
    const [reportStatusData, setReportStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isMentor = user?.role === "MENTOR";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError("");

            try {
                const [postsRes, postStatsRes] = await Promise.allSettled([
                    getPosts(),
                    getPostStats(),
                ]);

                const postsList =
                    postsRes.status === "fulfilled" && postsRes.value?.success
                        ? postsRes.value.posts
                        : [];

                const categoriesSet = new Set(postsList.map((p) => p.category).filter(Boolean));

                if (postStatsRes.status === "fulfilled" && postStatsRes.value?.success) {
                    setPostsPerDay(postStatsRes.value.postsPerDay || []);
                    setCategoryDistribution(postStatsRes.value.categoryDistribution || []);
                }

                let notifsList = [];
                if (token) {
                    try {
                        const notifRes = await getNotifications(token);
                        if (notifRes.success) notifsList = notifRes.notifications;
                    } catch { /* ignore */ }
                }

                let reportsList = [];
                let responsesList = [];
                if (isMentor && token) {
                    try {
                        const [repRes, compRes] = await Promise.allSettled([
                            getReports(token),
                            getComplaintResponses(token),
                        ]);
                        if (repRes.status === "fulfilled" && repRes.value?.success)
                            reportsList = repRes.value.reports;
                        if (compRes.status === "fulfilled" && compRes.value?.success)
                            responsesList = compRes.value.responses;
                    } catch { /* ignore */ }
                }

                if (reportsList.length > 0) {
                    const pending = reportsList.filter(
                        (r) => (r.status || "PENDING").toUpperCase() === "PENDING"
                    ).length;
                    setReportStatusData([
                        { name: "Pending", value: pending, fill: "#f44336" },
                        { name: "Resolved", value: reportsList.length - pending, fill: "#4caf50" },
                    ]);
                }

                let userStatsData = stats.userActivity;
                if (token) {
                    try {
                        const userStatsRes = await getUserStats();
                        if (userStatsRes.success) userStatsData = userStatsRes.stats;
                    } catch { /* ignore */ }
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
                    userActivity: userStatsData,
                });
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load dashboard data"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isMentor]);

    const radialData = [
        { name: "Posts", value: stats.userActivity.postsCount, fill: "#1976d2" },
        { name: "Comments", value: stats.userActivity.commentsCount, fill: "#00bcd4" },
        { name: "Votes Given", value: stats.userActivity.votesGiven, fill: "#ff9800" },
    ];

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pt: 4, pb: 8 }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                            Dashboard
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's what's happening on CampusVoice today.
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/create-post"
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
                        >
                            + New Post
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Profile Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: "2rem",
                        }}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                            Welcome back, {user?.name || "User"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                            {user?.email}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                            <Chip
                                label={user?.role || "STUDENT"}
                                color={isMentor ? "secondary" : "primary"}
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 1 }}
                            />
                            <Chip
                                label={`Anonymous ID: ${user?.anonymousHandle || "—"}`}
                                variant="outlined"
                                size="small"
                                sx={{ color: "text.secondary", borderRadius: 1 }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Global Statistics */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                            Platform Overview
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard label="Total Posts" value={stats.totalPosts} color="#1976d2" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard label="Categories" value={stats.totalCategories} color="#00bcd4" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    label="Notifications"
                                    value={stats.totalNotifications}
                                    color="#ff9800"
                                    sub={stats.unreadNotifications > 0 ? `${stats.unreadNotifications} unread` : null}
                                />
                            </Grid>
                            {isMentor ? (
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        label="Reports"
                                        value={stats.totalReports}
                                        color="#f44336"
                                        sub={stats.pendingReports > 0 ? `${stats.pendingReports} pending action` : null}
                                    />
                                </Grid>
                            ) : (
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard label="Reputation Score" value={stats.userActivity.reputation} color="#4caf50" />
                                </Grid>
                            )}
                        </Grid>

                        {/* Charts Section */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={8}>
                                <ChartCard title="Post Activity (Last 7 Days)">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={postsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<TooltipBox />} />
                                            <Area
                                                type="monotone"
                                                dataKey="posts"
                                                name="Posts"
                                                stroke={theme.palette.primary.main}
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorPosts)"
                                                activeDot={{ r: 6, strokeWidth: 0, fill: theme.palette.primary.main }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <ChartCard title="Posts by Category">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<TooltipBox />} cursor={{ fill: "#f1f5f9" }} />
                                            <Bar dataKey="count" name="Posts" radius={[4, 4, 0, 0]} barSize={32}>
                                                {categoryDistribution.map((_, i) => (
                                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </Grid>
                        </Grid>

                        {/* Bottom Row */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={isMentor ? 8 : 12}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                                    My Activity Summary
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard label="My Posts" value={stats.userActivity.postsCount} color="#1976d2" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard label="My Comments" value={stats.userActivity.commentsCount} color="#00bcd4" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard label="Votes Given" value={stats.userActivity.votesGiven} color="#9c27b0" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            label="Upvotes Received"
                                            value={stats.userActivity.upvotesReceived ?? 0}
                                            color="#4caf50"
                                            sub={stats.userActivity.downvotesReceived > 0 ? `${stats.userActivity.downvotesReceived} downvotes` : null}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {isMentor && (
                                <Grid item xs={12} md={4}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                                        Report Resolution
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor: "background.paper",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            height: 200,
                                        }}
                                    >
                                        {reportStatusData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={reportStatusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius="50%"
                                                        outerRadius="80%"
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {reportStatusData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<TooltipBox />} />
                                                    <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No reports available.
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;
