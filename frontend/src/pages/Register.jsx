import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import { registerUser } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiError";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await registerUser(formData);

            if (data.success) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            setError(getApiErrorMessage(error, "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        border: "1px solid #E2E8F0",
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                                color: "#FFFFFF",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1.5,
                                boxShadow: "0 6px 14px rgba(79, 70, 229, 0.25)",
                            }}
                        >
                            <CampaignIcon fontSize="medium" />
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                            Create Account
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                            Join CampusVoice to share and resolve campus feedback.
                        </Typography>
                    </Box>

                    {message && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>
                            {message}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        <TextField
                            label="Full Name"
                            name="name"
                            placeholder="Alex Morgan"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="alex@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Account Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                name="role"
                                value={formData.role}
                                label="Account Role"
                                onChange={handleChange}
                            >
                                <MenuItem value="STUDENT">Student</MenuItem>
                                <MenuItem value="MENTOR">Mentor / Admin</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={<PersonAddOutlinedIcon fontSize="small" />}
                            sx={{ py: 1.25, mt: 1 }}
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </Button>

                        <Box sx={{ textAlign: "center", mt: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748B" }}>
                                Already have an account?{" "}
                                <Typography
                                    component={Link}
                                    to="/login"
                                    variant="body2"
                                    sx={{ color: "#4F46E5", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                >
                                    Sign in
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;