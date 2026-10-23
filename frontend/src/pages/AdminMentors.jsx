import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { createMentor, getMentors } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const AdminMentors = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [listError, setListError] = useState("");

    const loadMentors = async () => {
        setListError("");
        try {
            const result = await getMentors();
            setMentors(result.mentors || []);
        } catch (loadError) {
            setListError(getApiErrorMessage(loadError, "Unable to load mentor accounts."));
        } finally {
            setLoadingMentors(false);
        }
    };

    useEffect(() => {
        loadMentors();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const result = await createMentor(form);
            setSuccess(`${result.message}: ${result.user.name} (${result.user.email}). Share the initial password securely.`);
            setForm({ name: "", email: "", password: "" });
            await loadMentors();
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, "Unable to create mentor account."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 7 } }}>
            <Container maxWidth="md">
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
                <Box sx={{ mt: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Mentor Accounts</Typography>
                            <Typography variant="body2" sx={{ color: "#64748B" }}>All mentor accounts created for CampusVoice.</Typography>
                        </Box>
                        <Chip label={`${mentors.length} total`} color="primary" variant="outlined" />
                    </Box>
                    {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}
                    {loadingMentors && <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>}
                    {!loadingMentors && !listError && mentors.length === 0 && <Alert severity="info">No mentor accounts yet. Create the first mentor above.</Alert>}
                    {!loadingMentors && mentors.map((mentor) => (
                        <Card key={mentor.id} elevation={0} sx={{ mb: 1.5, border: "1px solid #E2E8F0", borderRadius: 3 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", py: "16px !important" }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{mentor.name}</Typography>
                                    <Typography variant="body2" sx={{ color: "#64748B" }}>{mentor.email}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Chip size="small" label={`ID #${mentor.id}`} variant="outlined" />
                                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                                        Created {mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : "—"}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default AdminMentors;
