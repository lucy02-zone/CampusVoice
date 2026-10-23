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

const sections = [
    {
        title: "Content reports",
        description: "Review reports submitted about posts in the community.",
        path: "/admin/reports",
        icon: <FlagOutlinedIcon />,
    },
    {
        title: "Complaint responses",
        description: "View and manage official responses to campus complaints.",
        path: "/admin/complaint-responses",
        icon: <RateReviewOutlinedIcon />,
    },
];

const AdminDashboard = () => (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5, mb: 4 }}>
                Manage reports and official complaint responses.
            </Typography>
            <Grid container spacing={3}>
                {sections.map((section) => (
                    <Grid size={{ xs: 12, md: 6 }} key={section.path}>
                        <Card elevation={0} sx={{ height: "100%", border: "1px solid #E2E8F0", borderRadius: "16px" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ color: "#4F46E5", mb: 1 }}>{section.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{section.title}</Typography>
                                <Typography variant="body2" sx={{ color: "#64748B", my: 1.5 }}>{section.description}</Typography>
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
