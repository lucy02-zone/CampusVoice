import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Container, Typography } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { getComplaints } from "../api/complaintApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const AdminComplaints = () => {
    const { token } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getComplaints(token).then((data) => setComplaints(data.complaints || []))
            .catch((err) => setError(getApiErrorMessage(err, "Failed to load complaints")))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>Student Complaints</Typography>
            <Typography sx={{ color: "#64748B", mt: 0.5, mb: 3 }}>Review concerns submitted directly by students.</Typography>
            {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>}
            {!loading && error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && complaints.length === 0 && <Alert severity="info">No complaints have been submitted yet.</Alert>}
            {!loading && !error && complaints.map((complaint) => (
                <Card key={complaint.id} elevation={0} sx={{ mb: 2, border: "1px solid #E2E8F0", borderRadius: 3 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><ReportProblemOutlinedIcon color="primary" /><Typography variant="h6" sx={{ fontWeight: 700 }}>{complaint.subject}</Typography></Box>
                            <Chip size="small" label={complaint.status} color={complaint.status === "RESOLVED" ? "success" : complaint.status === "PENDING" ? "warning" : "default"} />
                        </Box>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>{complaint.category} · Submitted {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ""}</Typography>
                        <Typography sx={{ mt: 2, whiteSpace: "pre-line", color: "#334155" }}>{complaint.description}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default AdminComplaints;
