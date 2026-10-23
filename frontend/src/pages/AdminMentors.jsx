import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { createMentor, getMentors, updateMentor } from "../api/userApi";
import { getApiErrorMessage } from "../api/apiError";

const emptyForm = { name: "", email: "", password: "" };

const AdminMentors = () => {
    const [form, setForm] = useState(emptyForm);
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState("");
    const [editingMentor, setEditingMentor] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadMentors = useCallback(async () => {
        setError("");
        try {
            const result = await getMentors();
            setMentors(result.mentors || []);
        } catch (loadError) {
            setError(getApiErrorMessage(loadError, "Unable to load mentor accounts."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadMentors(); }, [loadMentors]);

    const visibleMentors = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return mentors;
        return mentors.filter((mentor) =>
            mentor.name?.toLowerCase().includes(query) ||
            mentor.email?.toLowerCase().includes(query) ||
            String(mentor.id).includes(query)
        );
    }, [mentors, search]);

    const openCreateDialog = () => {
        setEditingMentor(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setDialogOpen(true);
    };

    const openEditDialog = (mentor) => {
        setEditingMentor(mentor);
        setForm({ name: mentor.name, email: mentor.email, password: "" });
        setError("");
        setSuccess("");
        setDialogOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            const accountData = { name: form.name.trim(), email: form.email.trim() };
            const result = editingMentor
                ? await updateMentor(editingMentor.id, accountData)
                : await createMentor({ ...accountData, password: form.password });
            setSuccess(result.message || (editingMentor ? "Mentor updated." : "Mentor created."));
            setDialogOpen(false);
            await loadMentors();
        } catch (submitError) {
            setError(getApiErrorMessage(submitError, "Unable to save mentor account."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F3F7F6", py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexDirection: { xs: "column", sm: "row" }, mb: 3 }}>
                    <Box>
                        <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.25rem" }, fontWeight: 800 }}>Mentor Management</Typography>
                        <Typography sx={{ color: "#647B84", mt: 0.5 }}>Create, review, and update mentor accounts.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openCreateDialog}>Add Mentor</Button>
                </Box>

                {error && !dialogOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Paper elevation={0} sx={{ border: "1px solid #DCE6E3", borderRadius: 4, overflow: "hidden" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap", p: 2.5 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 750 }}>All mentors</Typography>
                            <Typography variant="body2" sx={{ color: "#647B84" }}>{mentors.length} account{mentors.length === 1 ? "" : "s"} in CampusVoice</Typography>
                        </Box>
                        <TextField
                            size="small"
                            placeholder="Search name, email, or ID"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            sx={{ width: { xs: "100%", sm: 310 } }}
                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> } }}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 7 }}><CircularProgress /></Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 720 }} aria-label="Mentor accounts">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#F3F7F6" }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Mentor</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Account ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleMentors.map((mentor) => (
                                        <TableRow key={mentor.id} hover>
                                            <TableCell sx={{ fontWeight: 650 }}>{mentor.name}</TableCell>
                                            <TableCell>{mentor.email}</TableCell>
                                            <TableCell>#{mentor.id}</TableCell>
                                            <TableCell>{mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : "—"}</TableCell>
                                            <TableCell><Chip size="small" color="primary" label="Mentor" /></TableCell>
                                            <TableCell align="right">
                                                <IconButton aria-label={`Edit ${mentor.name}`} title="Edit mentor" onClick={() => openEditDialog(mentor)} size="small"><EditOutlinedIcon fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!visibleMentors.length && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#647B84" }}>
                                                {mentors.length ? "No mentors match your search." : "No mentor accounts yet. Select Add Mentor to create one."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle sx={{ fontWeight: 750 }}>{editingMentor ? "Update Mentor" : "Create Mentor Account"}</DialogTitle>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "8px !important" }}>
                            {error && dialogOpen && <Alert severity="error">{error}</Alert>}
                            <TextField label="Full name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} disabled={saving} />
                            <TextField label="Email address" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} disabled={saving} />
                            {!editingMentor && <TextField label="Initial password" type="password" required inputProps={{ minLength: 8 }} helperText="At least 8 characters. Share it with the mentor securely." value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} disabled={saving} />}
                        </DialogContent>
                        <DialogActions sx={{ p: 2.5, pt: 1 }}>
                            <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving…" : editingMentor ? "Save Changes" : "Create Mentor"}</Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AdminMentors;
