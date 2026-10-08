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

const CHART_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a855f7"];

const TooltipBox = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box
            sx={{
                bgcolor: "rgba(15,15,25,0.92)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: 2,
                p: "10px 14px",
                backdropFilter: "blur(8px)",
            }}
        >
            {label && (
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mb: 0.5 }}>
                    {label}
                </Typography>
            )}
            {payload.map((entry, i) => (
                <Typography key={i} variant="body2" sx={{ color: entry.color || "#e2e8f0", fontWeight: 600 }}>
                    {entry.name}: {entry.value}
                </Typography>
            ))}
        </Box>
    );
};

const StatCard = ({ label, value, color = "primary.main", sub }) => (
    <Card
        sx={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            borderRadius: 3,
            background: "linear-gradient(145deg, #1e1e2e 0%, #16162a 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" },
        }}
    >
        <CardContent>
            <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontSize: "0.75rem", letterSpacing: 0.8, textTransform: "uppercase" }}>
                {label}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color, lineHeight: 1.1 }}>
                {value}
            </Typography>
            {sub && (
                <Typography variant="caption" sx={{ color: "#f59e0b", mt: 0.5, display: "block" }}>
                    {sub}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const ChartCard = ({ title, children, height = 280 }) => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            background: "linear-gradient(145deg, #1e1e2e 0%, #16162a 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            height: "100%",
        }}
    >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: "#e2e8f0", letterSpacing: -0.3 }}>
            {title}
        </Typography>
        <Box sx={{ width: "100%", height }}>
            {children}
        </Box>
    </Paper>
);

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
                        { name: "Pending", value: pending, fill: "#f43f5e" },
                        { name: "Resolved", value: reportsList.length - pending, fill: "#10b981" },
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
        { name: "Posts", value: stats.userActivity.postsCount, fill: "#6366f1" },
        { name: "Comments", value: stats.userActivity.commentsCount, fill: "#22d3ee" },
        { name: "Votes Given", value: stats.userActivity.votesGiven, fill: "#f59e0b" },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #0f0f1a 0%, #111827 60%, #0f172a 100%)",
                pt: 5,
                pb: 8,
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 0.5,
                    }}
                >
                    Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
                    Welcome back, {user?.name || "Campus User"} 👋
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
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
                        background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
                        boxShadow: "0 8px 32px rgba(79,70,229,0.35)",
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
                        },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", position: "relative" }}>
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: 800,
                                fontSize: "1.75rem",
                                border: "2px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {user?.name || "Campus User"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                {user?.email}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.5 }}>
                                Anonymous ID: <strong>ANON-{user?.id}</strong>
                            </Typography>
                        </Box>
                        <Chip
                            label={user?.role || "STUDENT"}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.18)",
                                color: "white",
                                fontWeight: 700,
                                border: "1px solid rgba(255,255,255,0.3)",
                                backdropFilter: "blur(4px)",
                            }}
                        />
                    </Box>
                </Paper>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 10 }}>
                        <CircularProgress sx={{ color: "#6366f1" }} size={56} thickness={4} />
                    </Box>
                ) : (
                    <>
                        {/* Overview stat cards */}
                        <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, mb: 1.5, display: "block" }}>
                            Overview &amp; Statistics
                        </Typography>

                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard label="Total Campus Posts" value={stats.totalPosts} color="#6366f1" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard label="Active Categories" value={stats.totalCategories} color="#22d3ee" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    label="Notifications"
                                    value={stats.totalNotifications}
                                    color="#10b981"
                                    sub={stats.unreadNotifications > 0 ? `${stats.unreadNotifications} unread` : null}
                                />
                            </Grid>
                            {isMentor ? (
                                <>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            label="Reported Posts"
                                            value={stats.totalReports}
                                            color="#f43f5e"
                                            sub={stats.pendingReports > 0 ? `${stats.pendingReports} pending` : null}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard label="Complaint Responses" value={stats.totalResponses} color="#a855f7" />
                                    </Grid>
                                </>
                            ) : (
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard label="My Reputation" value={stats.userActivity.reputation} color="#f59e0b" />
                                </Grid>
                            )}
                        </Grid>

                        {/* Charts Row 1 */}
                        <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, mb: 1.5, display: "block" }}>
                            Analytics
                        </Typography>

                        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                            <Grid item xs={12} md={8}>
                                <ChartCard title="📈 Posts Activity — Last 7 Days" height={260}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={postsPerDay} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                                            <Tooltip content={<TooltipBox />} />
                                            <Area
                                                type="monotone"
                                                dataKey="posts"
                                                name="Posts"
                                                stroke="#6366f1"
                                                strokeWidth={2.5}
                                                fill="url(#postsGrad)"
                                                dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                                                activeDot={{ r: 6, fill: "#818cf8" }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <ChartCard title="🎯 My Activity Breakdown" height={260}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            innerRadius="30%"
                                            outerRadius="90%"
                                            data={radialData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar
                                                minAngle={15}
                                                background={{ fill: "rgba(255,255,255,0.04)" }}
                                                clockWise
                                                dataKey="value"
                                                cornerRadius={6}
                                            />
                                            <Tooltip content={<TooltipBox />} />
                                            <Legend
                                                iconSize={10}
                                                formatter={(val) => (
                                                    <span style={{ color: "#94a3b8", fontSize: 12 }}>{val}</span>
                                                )}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </Grid>
                        </Grid>

                        {/* Charts Row 2 */}
                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={isMentor ? 8 : 12}>
                                <ChartCard title="📊 Posts by Category" height={260}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryDistribution} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barCategoryGap="35%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                                            <Tooltip content={<TooltipBox />} />
                                            <Bar dataKey="count" name="Posts" radius={[6, 6, 0, 0]}>
                                                {categoryDistribution.map((_, i) => (
                                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </Grid>

                            {isMentor && (
                                <Grid item xs={12} md={4}>
                                    <ChartCard title="🚨 Report Status" height={260}>
                                        {reportStatusData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={reportStatusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius="42%"
                                                        outerRadius="70%"
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        strokeWidth={0}
                                                    >
                                                        {reportStatusData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<TooltipBox />} />
                                                    <Legend
                                                        iconSize={10}
                                                        formatter={(val) => (
                                                            <span style={{ color: "#94a3b8", fontSize: 12 }}>{val}</span>
                                                        )}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                                <Typography variant="body2" sx={{ color: "#475569" }}>
                                                    No reports yet
                                                </Typography>
                                            </Box>
                                        )}
                                    </ChartCard>
                                </Grid>
                            )}
                        </Grid>

                        {/* My Activity stat cards */}
                        <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, mb: 1.5, display: "block" }}>
                            My Activity
                        </Typography>

                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            <Grid item xs={6} sm={3}>
                                <StatCard label="My Posts" value={stats.userActivity.postsCount} color="#6366f1" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatCard label="My Comments" value={stats.userActivity.commentsCount} color="#22d3ee" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatCard label="Votes Given" value={stats.userActivity.votesGiven} color="#a855f7" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatCard
                                    label="Upvotes Received"
                                    value={stats.userActivity.upvotesReceived ?? 0}
                                    color="#10b981"
                                    sub={
                                        stats.userActivity.downvotesReceived > 0
                                            ? `${stats.userActivity.downvotesReceived} downvotes`
                                            : null
                                    }
                                />
                            </Grid>
                        </Grid>

                        {/* Quick Actions */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: "linear-gradient(145deg, #1e1e2e 0%, #16162a 100%)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#e2e8f0" }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/posts"
                                    sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, borderRadius: 2 }}
                                >
                                    View Posts
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/create-post"
                                    sx={{ borderColor: "#6366f1", color: "#6366f1", "&:hover": { borderColor: "#818cf8", bgcolor: "rgba(99,102,241,0.08)" }, borderRadius: 2 }}
                                >
                                    Create Post
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/notifications"
                                    sx={{ borderColor: "#22d3ee", color: "#22d3ee", "&:hover": { borderColor: "#67e8f9", bgcolor: "rgba(34,211,238,0.08)" }, borderRadius: 2 }}
                                >
                                    Notifications ({stats.unreadNotifications})
                                </Button>
                                {isMentor && (
                                    <>
                                        <Button variant="outlined" color="error" component={Link} to="/admin/reports" sx={{ borderRadius: 2 }}>
                                            Admin Reports
                                        </Button>
                                        <Button variant="outlined" color="secondary" component={Link} to="/admin/complaint-responses" sx={{ borderRadius: 2 }}>
                                            Admin Complaints
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;
