import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, MenuItem, Paper, TextField, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { createComplaint } from "../api/complaintApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const CreateComplaint = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form, setForm] = useState({ subject: "", category: "", description: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await createComplaint({
                subject: form.subject.trim(),
                category: form.category,
                description: form.description.trim(),
            }, token);
            if (result.success) navigate("/dashboard", { state: { complaintSubmitted: true } });
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, "Unable to submit your complaint"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 7 } }}>
            <Container maxWidth="sm">
                <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 3, md: 5 }, border: "1px solid #E2E8F0", borderRadius: "16px" }}>
                    <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 800, mb: 1 }}>Raise a Complaint</Typography>
                    <Typography sx={{ color: "#64748B", mb: 3 }}>Submit a campus concern directly to the administration, separately from community posts.</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField label="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} disabled={loading} inputProps={{ maxLength: 160 }} />
                        <TextField select label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={loading}>
                            {["Academics", "Facilities", "Safety", "Housing", "Harassment", "Other"].map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                        </TextField>
                        <TextField label="Complaint details" required multiline rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} />
                        <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={<SendOutlinedIcon />}>{loading ? "Submitting…" : "Submit Complaint"}</Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateComplaint;
