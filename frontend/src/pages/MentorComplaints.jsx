import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { createComplaintResponse, getComplaintResponses } from "../api/complaintResponseApi";
import { getComplaints } from "../api/complaintApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const MentorComplaints = () => {
    const { token } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [responses, setResponses] = useState([]);
    const [drafts, setDrafts] = useState({});
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadQueue = useCallback(async () => {
        const [complaintData, responseData] = await Promise.all([getComplaints(token), getComplaintResponses(token)]);
        setComplaints(complaintData.complaints || []);
        setResponses(responseData.responses || []);
    }, [token]);

    useEffect(() => {
        loadQueue().catch((loadError) => setError(getApiErrorMessage(loadError, "Unable to load complaints.")))
            .finally(() => setLoading(false));
    }, [loadQueue]);

    const submitResponse = async (complaintId, status) => {
        const response = (drafts[complaintId] || "").trim();
        if (!response) {
            setError("Write a response before submitting.");
            return;
        }
        setError("");
        setSuccess("");
        setBusyId(complaintId);
        try {
            const result = await createComplaintResponse({ complaintId, response, status }, token);
            setSuccess(result.message || "Response submitted.");
            setDrafts((previous) => ({ ...previous, [complaintId]: "" }));
            await loadQueue();
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, "Unable to submit your response."));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>Complaint Review</Typography>
            <Typography sx={{ color: "#647B84", mt: 0.5, mb: 3 }}>Review student complaints and send an official response.</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>}
            {!loading && complaints.length === 0 && <Alert severity="info">There are no complaints to review.</Alert>}
            {!loading && complaints.map((complaint) => {
                const complaintResponses = responses.filter((item) => item.complaintId === complaint.id);
                return (
                    <Card key={complaint.id} elevation={0} sx={{ mb: 2, border: "1px solid #DCE6E3", borderRadius: 3 }}>
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{complaint.subject}</Typography>
                                    <Typography variant="caption" sx={{ color: "#647B84" }}>{complaint.category} · {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ""}</Typography>
                                </Box>
                                <Chip size="small" label={complaint.status} color={complaint.status === "RESOLVED" ? "success" : complaint.status === "PENDING" ? "warning" : "default"} />
                            </Box>
                            <Typography sx={{ mt: 2, mb: 2, whiteSpace: "pre-line", color: "#3E5664" }}>{complaint.description}</Typography>
                            {complaintResponses.map((item) => <Alert key={item.id} severity={item.status === "RESOLVED" ? "success" : "info"} sx={{ mb: 1 }}>{item.response}</Alert>)}
                            {complaint.status !== "RESOLVED" && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                                    <TextField label="Official response" multiline minRows={2} value={drafts[complaint.id] || ""} onChange={(e) => setDrafts((previous) => ({ ...previous, [complaint.id]: e.target.value }))} disabled={busyId === complaint.id} />
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
                                        <Button variant="outlined" disabled={busyId === complaint.id} onClick={() => submitResponse(complaint.id, "REVIEWED")}>Respond and mark reviewed</Button>
                                        <Button variant="contained" disabled={busyId === complaint.id} onClick={() => submitResponse(complaint.id, "RESOLVED")}>Resolve complaint</Button>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </Container>
    );
};

export default MentorComplaints;
