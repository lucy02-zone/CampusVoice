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
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useAuth } from "../context/AuthContext";
import { getPosts, getPostStats } from "../api/postApi";
import { getNotifications } from "../api/notificationApi";
import { getReports } from "../api/reportApi";
import { getComplaintResponses } from "../api/complaintResponseApi";
import { getUserStats } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const CHART_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];

const formatNumber = (value) => Number(value ?? 0).toLocaleString();

const StatCard = ({ label, value, icon: Icon, accent = "#4F46E5", caption }) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            p: 2.5,
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
            "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "#CBD5E1",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
            },
        }}
    >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>
                {label}
            </Typography>
            {Icon && (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: `${accent}14`,
                        color: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon fontSize="small" />
                </Box>
            )}
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5, fontVariantNumeric: "tabular-nums" }}>
            {formatNumber(value)}
        </Typography>

        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500 }}>
            {caption || "Current total"}
        </Typography>
    </Card>
);

const ChartPanel = ({ title, subtitle, children, height = 280 }) => (
    <Paper
        elevation={0}
        sx={{
            height: "100%",
            p: { xs: 2.5, md: 3 },
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            minWidth: 0,
        }}
    >
        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
            {title}
        </Typography>

        {subtitle && (
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
                {subtitle}
            </Typography>
        )}

        <Box sx={{ width: "100%", height, mt: subtitle ? 0 : 2 }}>
            {children}
        </Box>
    </Paper>
);

const EmptyChart = ({ message = "No data available yet." }) => (
    <Box
        sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
        }}
    >
        <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center" }}>
            {message}
        </Typography>
    </Box>
);

const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#0F172A", display: "block", mb: 0.5 }}>
                    {label}
                </Typography>
                {payload.map((entry, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: entry.color || "#4F46E5", fontWeight: 600 }}>
                        {entry.name}: {entry.value}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const Dashboard = () => {
    const { user, token } = useAuth();
    const isMentor = user?.role === "MENTOR";

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

    useEffect(() => {
        let active = true;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError("");

            try {
                const [postsResult, postStatsResult] = await Promise.allSettled([
                    getPosts(),
                    getPostStats(),
                ]);

                if (!active) return;

                if (postsResult.status === "rejected") {
                    throw postsResult.reason;
                }

                const postsResponse = postsResult.value;

                if (!postsResponse?.success) {
                    throw new Error("Unable to load posts.");
                }

                const posts = postsResponse.posts || [];
                const categories = new Set(
                    posts.map((post) => post.category).filter(Boolean)
                );

                if (
                    postStatsResult.status === "fulfilled" &&
                    postStatsResult.value?.success
                ) {
                    setPostsPerDay(postStatsResult.value.postsPerDay || []);
                    setCategoryDistribution(
                        postStatsResult.value.categoryDistribution || []
                    );
                } else {
                    setPostsPerDay([]);
                    setCategoryDistribution([]);
                }

                let notifications = [];
                let reports = [];
                let responses = [];

                const optionalRequests = [];

                if (token) {
                    optionalRequests.push(
                        getNotifications(token)
                            .then((result) => {
                                if (result?.success) {
                                    notifications = result.notifications || [];
                                }
                            })
                            .catch(() => { })
                    );

                    optionalRequests.push(
                        getUserStats()
                            .then((result) => {
                                if (result?.success && active) {
                                    setStats((previous) => ({
                                        ...previous,
                                        userActivity: {
                                            ...previous.userActivity,
                                            ...result.stats,
                                        },
                                    }));
                                }
                            })
                            .catch(() => { })
                    );
                }

                if (isMentor && token) {
                    optionalRequests.push(
                        getReports(token)
                            .then((result) => {
                                if (result?.success) {
                                    reports = result.reports || [];
                                }
                            })
                            .catch(() => { })
                    );

                    optionalRequests.push(
                        getComplaintResponses(token)
                            .then((result) => {
                                if (result?.success) {
                                    responses = result.responses || [];
                                }
                            })
                            .catch(() => { })
                    );
                }

                await Promise.all(optionalRequests);

                if (!active) return;

                const pendingReports = reports.filter(
                    (report) =>
                        (report.status || "PENDING").toUpperCase() === "PENDING"
                ).length;

                setReportStatusData(
                    reports.length
                        ? [
                            {
                                name: "Pending",
                                value: pendingReports,
                                fill: "#F59E0B",
                            },
                            {
                                name: "Reviewed / Resolved",
                                value: reports.length - pendingReports,
                                fill: "#10B981",
                            },
                        ]
                        : []
                );

                setStats((previous) => ({
                    ...previous,
                    totalPosts: posts.length,
                    totalCategories: categories.size,
                    totalNotifications: notifications.length,
                    unreadNotifications: notifications.filter((item) => !item.isRead).length,
                    totalReports: reports.length,
                    pendingReports,
                    totalResponses: responses.length,
                }));
            } catch (err) {
                if (active) {
                    setError(
                        getApiErrorMessage(err, "Unable to load dashboard information.")
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchDashboardData();

        return () => {
            active = false;
        };
    }, [token, isMentor]);

    const activityData = [
        { name: "Posts", value: stats.userActivity.postsCount || 0 },
        { name: "Comments", value: stats.userActivity.commentsCount || 0 },
        { name: "Votes", value: stats.userActivity.votesGiven || 0 },
    ];

    const chartTheme = {
        fontSize: 12,
        fill: "#64748B",
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2rem" }, fontWeight: 800 }}>
                            Community Dashboard
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
                            Real-time platform insights, personal activity, and mentor controls.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/create-post"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: "10px",
                            px: 2.5,
                            py: 1.25,
                        }}
                    >
                        New Post
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
                        {error}
                    </Alert>
                )}

                {/* Profile Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        mb: 4,
                        border: "1px solid #E2E8F0",
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2.5,
                            flexWrap: "wrap",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: "rgba(79, 70, 229, 0.1)",
                                color: "#4F46E5",
                                fontWeight: 800,
                                fontSize: "1.25rem",
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Welcome back, {user?.name || "User"}
                                </Typography>
                                <Chip
                                    label={user?.role || "STUDENT"}
                                    size="small"
                                    sx={{
                                        bgcolor: isMentor ? "rgba(14, 165, 233, 0.1)" : "rgba(79, 70, 229, 0.1)",
                                        color: isMentor ? "#0284C7" : "#4F46E5",
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: "#64748B" }}>
                                {user?.email}
                            </Typography>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#F8FAFC", p: 1.5, borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                            <AlternateEmailIcon sx={{ color: "#64748B", fontSize: 20 }} />
                            <Box>
                                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600, display: "block", textTransform: "uppercase", fontSize: "0.65rem" }}>
                                    Anonymous Handle
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>
                                    {user?.anonymousHandle || "—"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {loading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
                    </Box>
                ) : (
                    <>
                        {/* Platform Metrics */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0F172A" }}>
                                Key Metrics
                            </Typography>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Total Posts"
                                        value={stats.totalPosts}
                                        icon={ArticleOutlinedIcon}
                                        accent="#4F46E5"
                                        caption="Across campus topics"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Categories"
                                        value={stats.totalCategories}
                                        icon={CategoryOutlinedIcon}
                                        accent="#0EA5E9"
                                        caption="Active discussion topics"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Notifications"
                                        value={stats.totalNotifications}
                                        icon={NotificationsNoneOutlinedIcon}
                                        accent="#F59E0B"
                                        caption={`${stats.unreadNotifications} unread messages`}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label={isMentor ? "Pending Reports" : "Reputation Score"}
                                        value={isMentor ? stats.pendingReports : stats.userActivity.reputation}
                                        icon={isMentor ? ReportProblemOutlinedIcon : ShieldOutlinedIcon}
                                        accent={isMentor ? "#EF4444" : "#10B981"}
                                        caption={isMentor ? "Reports awaiting action" : "Your community score"}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Visual Analytics */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0F172A" }}>
                                Analytics & Activity Trends
                            </Typography>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} lg={8}>
                                    <ChartPanel
                                        title="Post Activity Trend"
                                        subtitle="Posts submitted over recent days"
                                        height={280}
                                    >
                                        {postsPerDay.length ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={postsPerDay}
                                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="postGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                                                            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                                    <XAxis dataKey="date" tick={chartTheme} axisLine={false} tickLine={false} />
                                                    <YAxis allowDecimals={false} tick={chartTheme} axisLine={false} tickLine={false} />
                                                    <Tooltip content={<CustomTooltipContent />} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="count"
                                                        name="Posts"
                                                        stroke="#4F46E5"
                                                        strokeWidth={2.5}
                                                        fill="url(#postGradient)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="No activity recorded for this period." />
                                        )}
                                    </ChartPanel>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <ChartPanel
                                        title="Category Distribution"
                                        subtitle="Posts broken down by category"
                                        height={280}
                                    >
                                        {categoryDistribution.length ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categoryDistribution}
                                                        dataKey="count"
                                                        nameKey="category"
                                                        cx="50%"
                                                        cy="45%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        stroke="none"
                                                    >
                                                        {categoryDistribution.map((entry, index) => (
                                                            <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltipContent />} />
                                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="No category data available." />
                                        )}
                                    </ChartPanel>
                                </Grid>

                                <Grid item xs={12} md={isMentor ? 6 : 12}>
                                    <ChartPanel
                                        title="Your Engagement Overview"
                                        subtitle="Summary of your posts, comments, and votes"
                                        height={250}
                                    >
                                        {activityData.some((item) => item.value > 0) ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                                    <XAxis dataKey="name" tick={chartTheme} axisLine={false} tickLine={false} />
                                                    <YAxis allowDecimals={false} tick={chartTheme} axisLine={false} tickLine={false} />
                                                    <Tooltip content={<CustomTooltipContent />} />
                                                    <Bar dataKey="value" name="Total" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                                        {activityData.map((entry, index) => (
                                                            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="Your personal engagement metrics will show up here." />
                                        )}
                                    </ChartPanel>
                                </Grid>

                                {isMentor && (
                                    <Grid item xs={12} md={6}>
                                        <ChartPanel
                                            title="Report Resolution Status"
                                            subtitle={`${stats.totalReports} total reports submitted`}
                                            height={250}
                                        >
                                            {reportStatusData.some((item) => item.value > 0) ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={reportStatusData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="45%"
                                                            innerRadius={50}
                                                            outerRadius={80}
                                                            paddingAngle={4}
                                                            stroke="none"
                                                        >
                                                            {reportStatusData.map((item) => (
                                                                <Cell key={item.name} fill={item.fill} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltipContent />} />
                                                        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <EmptyChart message="No reports logged in the system." />
                                            )}
                                        </ChartPanel>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;