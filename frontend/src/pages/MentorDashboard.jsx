import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { getComplaints } from "../api/complaintApi";
import { getReports } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const MentorDashboard = () => {
    const { user, token } = useAuth();
    const [counts, setCounts] = useState({ pendingComplaints: 0, pendingReports: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        Promise.all([getComplaints(token), getReports(token)])
            .then(([complaintData, reportData]) => {
                if (!active) return;
                setCounts({
                    pendingComplaints: (complaintData.complaints || []).filter((item) => item.status === "PENDING").length,
                    pendingReports: (reportData.reports || []).filter((item) => item.status === "PENDING").length,
                });
            })
            .catch((loadError) => {
                if (active) setError(getApiErrorMessage(loadError, "Unable to load your review queue."));
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [token]);

    const cards = [
        { title: "Student complaints", count: counts.pendingComplaints, caption: "Awaiting mentor review", path: "/mentor/complaints", icon: <RateReviewOutlinedIcon /> },
        { title: "Content reports", count: counts.pendingReports, caption: "Reported posts to review", path: "/mentor/reports", icon: <FlagOutlinedIcon /> },
        { title: "Campus feed", count: null, caption: "Join student discussions", path: "/posts", icon: <ForumOutlinedIcon /> },
    ];

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.3rem" }, fontWeight: 800 }}>Mentor Workspace</Typography>
                <Typography sx={{ color: "#64748B", mt: 0.5, mb: 4 }}>Welcome, {user?.name || "Mentor"}. Review student concerns and reported content.</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                    <Grid container spacing={2.5}>
                        {cards.map((card) => (
                            <Grid size={{ xs: 12, md: 4 }} key={card.path}>
                                <Card elevation={0} sx={{ height: "100%", border: "1px solid #E2E8F0", borderRadius: 4 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ color: "#4F46E5", mb: 1 }}>{card.icon}</Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{card.title}</Typography>
                                        {card.count !== null && <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>{card.count}</Typography>}
                                        <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>{card.caption}</Typography>
                                        <Button component={Link} to={card.path} variant="outlined">Open</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default MentorDashboard;
