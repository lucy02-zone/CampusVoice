import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";

import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    const features = [
        {
            icon: <SecurityOutlinedIcon sx={{ fontSize: 26, color: "#4F46E5" }} />,
            title: "100% Anonymous Posting",
            description:
                "Express your concerns, report issues, or suggest improvements without compromising your identity or privacy.",
        },
        {
            icon: <ForumOutlinedIcon sx={{ fontSize: 26, color: "#0EA5E9" }} />,
            title: "Campus Community Feed",
            description:
                "Engage with posts from fellow students through upvotes, downvotes, and constructive discussions.",
        },
        {
            icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 26, color: "#10B981" }} />,
            title: "Mentor Oversight & Action",
            description:
                "Dedicated campus mentors review complaints, provide official responses, and resolve active issues transparently.",
        },
        {
            icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 26, color: "#F59E0B" }} />,
            title: "Real-Time Updates",
            description:
                "Stay informed with instant notifications whenever your posts get responses, votes, or status updates.",
        },
    ];

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, minHeight: "calc(100vh - 64px)" }}>
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box
                    sx={{
                        textAlign: "center",
                        maxWidth: 780,
                        mx: "auto",
                        mb: { xs: 6, md: 10 },
                    }}
                >
                    <Chip
                        icon={<CampaignIcon style={{ fontSize: 16, color: "#4F46E5" }} />}
                        label="Anonymous Campus Feedback Platform"
                        sx={{
                            bgcolor: "rgba(79, 70, 229, 0.08)",
                            color: "#4F46E5",
                            fontWeight: 700,
                            mb: 3,
                            px: 1,
                            py: 0.5,
                            border: "1px solid rgba(79, 70, 229, 0.2)",
                        }}
                    />

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                            mb: 2.5,
                        }}
                    >
                        Speak Up. Drive Change.{" "}
                        <span style={{ color: "#4F46E5" }}>Anonymously.</span>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            color: "#64748B",
                            lineHeight: 1.7,
                            mb: 4,
                            px: { xs: 2, sm: 4 },
                        }}
                    >
                        CampusVoice empowers students to voice concerns, report facilities or academic issues, and collaborate with campus leaders — all while keeping identity protected.
                    </Typography>

                    {isAuthenticated ? (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/posts"
                                startIcon={<ExploreOutlinedIcon />}
                                endIcon={<ArrowForwardOutlinedIcon />}
                                sx={{ py: 1.5, px: 3.5, fontSize: "0.9375rem" }}
                            >
                                Explore Campus Feed
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/create-post"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{ py: 1.5, px: 3.5, fontSize: "0.9375rem" }}
                            >
                                Submit Anonymous Post
                            </Button>
                        </Stack>
                    ) : (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/login"
                                endIcon={<ArrowForwardOutlinedIcon />}
                                sx={{ py: 1.5, px: 4, fontSize: "0.9375rem" }}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/register"
                                sx={{ py: 1.5, px: 4, fontSize: "0.9375rem" }}
                            >
                                Create Account
                            </Button>
                        </Stack>
                    )}
                </Box>

                {/* Features Grid */}
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: "center",
                            fontWeight: 700,
                            mb: 4,
                            color: "#0F172A",
                        }}
                    >
                        Designed for Student Empowerment & Campus Quality
                    </Typography>

                    <Grid container spacing={3}>
                        {features.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        p: 1,
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 12px 24px -6px rgba(15, 23, 42, 0.08)",
                                            borderColor: "#CBD5E1",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "12px",
                                                bgcolor: "#F1F5F9",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 2,
                                            }}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700, mb: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.6 }}>
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;