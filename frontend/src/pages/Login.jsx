import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            if (data.success) {
                login(data);
                navigate("/");
            }
        } catch (error) {
            setError(getApiErrorMessage(error, "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 6, md: 10 } }}>
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
                            Welcome Back
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                            Log in to access your CampusVoice dashboard.
                        </Typography>
                    </Box>

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
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="student@university.edu"
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

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={<LockOutlinedIcon fontSize="small" />}
                            sx={{ py: 1.25, mt: 1 }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <Box sx={{ textAlign: "center", mt: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748B" }}>
                                Don't have an account?{" "}
                                <Typography
                                    component={Link}
                                    to="/register"
                                    variant="body2"
                                    sx={{ color: "#4F46E5", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                >
                                    Register here
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;