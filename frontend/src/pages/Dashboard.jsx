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

import { useAuth } from "../context/AuthContext";
import { getPosts, getPostStats } from "../api/postApi";
import { getNotifications } from "../api/notificationApi";
import { getReports } from "../api/reportApi";
import { getComplaintResponses } from "../api/complaintResponseApi";
import { getUserStats } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const COLORS = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626"];

const formatNumber = (value) => Number(value ?? 0).toLocaleString();

const StatCard = ({ label, value, accent, caption }) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            transition: "border-color 180ms ease, box-shadow 180ms ease",
            "&:hover": {
                borderColor: accent,
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
            },
        }}
    >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box
                sx={{
                    width: 34,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: accent,
                    mb: 2,
                }}
            />

            <Typography
                sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748B",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#172033",
                    lineHeight: 1.5,
                    mt: 0.5,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {formatNumber(value)}
            </Typography>

            <Typography sx={{ fontSize: 12, color: "#94A3B8", mt: 0.5 }}>
                {caption || "Current total"}
            </Typography>
        </CardContent>
    </Card>
);

const ChartPanel = ({ title, subtitle, children, height = 280 }) => (
    <Paper
        elevation={0}
        sx={{
            height: "100%",
            p: { xs: 2, md: 2.5 },
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            minWidth: 0,
        }}
    >
        <Typography
            sx={{ fontSize: 15, fontWeight: 700, color: "#172033" }}
        >
            {title}
        </Typography>

        {subtitle && (
            <Typography sx={{ fontSize: 12, color: "#94A3B8", mt: 0.5, mb: 2 }}>
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
        <Typography sx={{ fontSize: 13, color: "#94A3B8", textAlign: "center" }}>
            {message}
        </Typography>
    </Box>
);

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
                                fill: "#D97706",
                            },
                            {
                                name: "Reviewed / Resolved",
                                value: reports.length - pendingReports,
                                fill: "#059669",
                            },
                        ]
                        : []
                );

                setStats((previous) => ({
                    ...previous,
                    totalPosts: posts.length,
                    totalCategories: categories.size,
                    totalNotifications: notifications.length,
                    unreadNotifications: notifications.filter((item) => !item.isRead)
                        .length,
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
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#F8FAFC",
                py: { xs: 3, md: 4 },
            }}
        >
            <Container maxWidth="xl">
                {/* Page header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: 25, md: 29 },
                                fontWeight: 750,
                                color: "#172033",
                                letterSpacing: "-0.7px",
                            }}
                        >
                            Dashboard
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "#64748B", mt: 0.5 }}>
                            Your CampusVoice activity and community overview.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/create-post"
                        variant="contained"
                        disableElevation
                        sx={{
                            bgcolor: "#4F46E5",
                            borderRadius: 1.5,
                            px: 2.5,
                            py: 1.1,
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#4338CA" },
                        }}
                    >
                        + Create post
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Profile summary */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 2.5 },
                        mb: 4,
                        border: "1px solid #E5E7EB",
                        borderRadius: 2,
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 54,
                                height: 54,
                                bgcolor: "#EEF2FF",
                                color: "#4338CA",
                                fontWeight: 700,
                                fontSize: 21,
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 180 }}>
                            <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#172033" }}>
                                Welcome back, {user?.name || "User"}
                            </Typography>

                            <Typography sx={{ fontSize: 13, color: "#64748B", mt: 0.3 }}>
                                {user?.email}
                            </Typography>
                        </Box>

                        <Chip
                            label={user?.role || "STUDENT"}
                            size="small"
                            sx={{
                                bgcolor: isMentor ? "#F3E8FF" : "#EEF2FF",
                                color: isMentor ? "#7E22CE" : "#4338CA",
                                fontWeight: 700,
                                fontSize: 11,
                                borderRadius: 1,
                            }}
                        />

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ display: { xs: "none", md: "block" }, mx: 1 }}
                        />

                        <Box sx={{ minWidth: 120 }}>
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#94A3B8",
                                    letterSpacing: 0.8,
                                    textTransform: "uppercase",
                                }}
                            >
                                Anonymous handle
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#334155",
                                    mt: 0.5,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {user?.anonymousHandle || "—"}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {loading ? (
                    <Box
                        sx={{
                            minHeight: 260,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress size={32} sx={{ color: "#4F46E5" }} />
                    </Box>
                ) : (
                    <>
                        {/* Platform overview */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#172033",
                                    mb: 2,
                                }}
                            >
                                Platform overview
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Total posts"
                                        value={stats.totalPosts}
                                        accent="#4F46E5"
                                        caption="Across the community"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Categories"
                                        value={stats.totalCategories}
                                        accent="#0891B2"
                                        caption="Categories in use"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Notifications"
                                        value={stats.totalNotifications}
                                        accent="#D97706"
                                        caption={`${stats.unreadNotifications} unread`}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label={isMentor ? "Pending reports" : "Reputation score"}
                                        value={
                                            isMentor
                                                ? stats.pendingReports
                                                : stats.userActivity.reputation
                                        }
                                        accent={isMentor ? "#DC2626" : "#059669"}
                                        caption={
                                            isMentor ? "Awaiting review" : "Your community score"
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Analytics */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#172033",
                                    mb: 2,
                                }}
                            >
                                Community analytics
                            </Typography>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} lg={8}>
                                    <ChartPanel
                                        title="Post activity"
                                        subtitle="Posts created over the last seven days"
                                        height={280}
                                    >
                                        {postsPerDay.length ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={postsPerDay}
                                                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="dashboardPostGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#4F46E5"
                                                                stopOpacity={0.18}
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#4F46E5"
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <CartesianGrid
                                                        stroke="#E2E8F0"
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="date"
                                                        tick={chartTheme}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={10}
                                                    />

                                                    <YAxis
                                                        allowDecimals={false}
                                                        tick={chartTheme}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />

                                                    <Tooltip
                                                        contentStyle={{
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: 8,
                                                            fontSize: 12,
                                                            boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                                                        }}
                                                    />

                                                    <Area
                                                        type="monotone"
                                                        dataKey="posts"
                                                        name="Posts"
                                                        stroke="#4F46E5"
                                                        strokeWidth={2.5}
                                                        fill="url(#dashboardPostGradient)"
                                                        activeDot={{ r: 4 }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="Activity will appear when post statistics are available." />
                                        )}
                                    </ChartPanel>
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <ChartPanel
                                        title="Posts by category"
                                        subtitle="Distribution across categories"
                                        height={280}
                                    >
                                        {categoryDistribution.length ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={categoryDistribution}
                                                    margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
                                                >
                                                    <CartesianGrid
                                                        stroke="#E2E8F0"
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="category"
                                                        tick={{ ...chartTheme, fontSize: 10 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={8}
                                                    />

                                                    <YAxis
                                                        allowDecimals={false}
                                                        tick={chartTheme}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />

                                                    <Tooltip
                                                        contentStyle={{
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: 8,
                                                            fontSize: 12,
                                                        }}
                                                    />

                                                    <Bar
                                                        dataKey="count"
                                                        name="Posts"
                                                        fill="#4F46E5"
                                                        radius={[4, 4, 0, 0]}
                                                        maxBarSize={38}
                                                    >
                                                        {categoryDistribution.map((item, index) => (
                                                            <Cell
                                                                key={item.category || index}
                                                                fill={COLORS[index % COLORS.length]}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="Category statistics are not available yet." />
                                        )}
                                    </ChartPanel>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Personal activity */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#172033",
                                    mb: 2,
                                }}
                            >
                                My activity
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="My posts"
                                        value={stats.userActivity.postsCount}
                                        accent="#4F46E5"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="My comments"
                                        value={stats.userActivity.commentsCount}
                                        accent="#0891B2"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Votes given"
                                        value={stats.userActivity.votesGiven}
                                        accent="#D97706"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        label="Upvotes received"
                                        value={stats.userActivity.upvotesReceived}
                                        accent="#059669"
                                        caption={`${formatNumber(
                                            stats.userActivity.downvotesReceived
                                        )} downvotes received`}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Activity breakdown */}
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} md={isMentor ? 6 : 12}>
                                <ChartPanel
                                    title="My activity breakdown"
                                    subtitle="Your contributions on CampusVoice"
                                    height={250}
                                >
                                    {activityData.some((item) => item.value > 0) ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={activityData}
                                                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                                            >
                                                <CartesianGrid
                                                    stroke="#E2E8F0"
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                    tick={chartTheme}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                <YAxis
                                                    allowDecimals={false}
                                                    tick={chartTheme}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        border: "1px solid #E5E7EB",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Bar
                                                    dataKey="value"
                                                    name="Total"
                                                    fill="#4F46E5"
                                                    radius={[4, 4, 0, 0]}
                                                    maxBarSize={52}
                                                >
                                                    {activityData.map((item, index) => (
                                                        <Cell
                                                            key={item.name}
                                                            fill={COLORS[index]}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart message="Your activity summary will appear here as you participate." />
                                    )}
                                </ChartPanel>
                            </Grid>

                            {isMentor && (
                                <Grid item xs={12} md={6}>
                                    <ChartPanel
                                        title="Report resolution"
                                        subtitle={`${stats.totalReports} total reports`}
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
                                                        innerRadius={55}
                                                        outerRadius={85}
                                                        paddingAngle={3}
                                                        stroke="none"
                                                    >
                                                        {reportStatusData.map((item) => (
                                                            <Cell key={item.name} fill={item.fill} />
                                                        ))}
                                                    </Pie>

                                                    <Tooltip
                                                        contentStyle={{
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: 8,
                                                            fontSize: 12,
                                                        }}
                                                    />

                                                    <Legend
                                                        verticalAlign="bottom"
                                                        iconType="circle"
                                                        wrapperStyle={{ fontSize: 11 }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="No reports available yet." />
                                        )}
                                    </ChartPanel>
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