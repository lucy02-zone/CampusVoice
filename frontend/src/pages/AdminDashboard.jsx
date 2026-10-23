import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

const sections = [
    {
        title: "Content reports",
        description: "Review reports submitted about posts in the community.",
        path: "/admin/reports",
        icon: <FlagOutlinedIcon />,
    },
    {
        title: "Complaints",
        description: "Review and manage campus complaints.",
        path: "/admin/complaints",
        icon: <RateReviewOutlinedIcon />,
    },
    {
        title: "Mentor accounts",
        description: "Create mentor logins and monitor all mentor accounts.",
        path: "/admin/mentors",
        icon: <PersonAddAlt1OutlinedIcon />,
    },
];

const AdminDashboard = () => (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F3F7F6", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "#647B84", mt: 0.5, mb: 4 }}>
                Manage reports and official complaint responses.
            </Typography>
            <Grid container spacing={3}>
                {sections.map((section) => (
                    <Grid size={{ xs: 12, md: 6 }} key={section.path}>
                        <Card elevation={0} sx={{ height: "100%", border: "1px solid #DCE6E3", borderRadius: "16px" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ color: "#0F766E", mb: 1 }}>{section.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{section.title}</Typography>
                                <Typography variant="body2" sx={{ color: "#647B84", my: 1.5 }}>{section.description}</Typography>
                                <Button component={Link} to={section.path} endIcon={<ArrowForwardOutlinedIcon />}>
                                    Open
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
);

export default AdminDashboard;
