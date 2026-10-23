import { useState } from "react";
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { createMentor } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const AdminMentors = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const result = await createMentor(form);
            setSuccess(`${result.message}: ${result.user.name} (${result.user.email}). Share the initial password securely.`);
            setForm({ name: "", email: "", password: "" });
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, "Unable to create mentor account."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 7 } }}>
            <Container maxWidth="sm">
                <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 3, md: 5 }, border: "1px solid #E2E8F0", borderRadius: "16px" }}>
                    <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.1rem" }, fontWeight: 800 }}>Create Mentor Account</Typography>
                    <Typography sx={{ color: "#64748B", mt: 0.5, mb: 3 }}>Create a mentor login with access to student community features.</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
                        <TextField label="Email address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} />
                        <TextField label="Initial password" type="password" required inputProps={{ minLength: 8 }} helperText="At least 8 characters. Share it with the mentor securely." value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={loading} />
                        <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={<PersonAddAlt1OutlinedIcon />}>
                            {loading ? "Creating…" : "Create Mentor"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminMentors;
