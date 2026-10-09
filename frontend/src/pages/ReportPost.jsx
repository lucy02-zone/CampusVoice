import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

import { createReport } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const ReportPost = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token } = useAuth();

    const postId = searchParams.get("postId");

    const [formData, setFormData] = useState({
        reason: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!postId) {
            setError("Missing Post ID. Please navigate from a valid post to report.");
            return;
        }

        const trimmedReason = formData.reason.trim();
        const trimmedDescription = formData.description.trim();

        const validationErrors = {};
        if (!trimmedReason) {
            validationErrors.reason = "Please select a reason for reporting";
        }
        if (!trimmedDescription) {
            validationErrors.description = "Description is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const data = await createReport(
                {
                    postId,
                    reason: trimmedReason,
                    description: trimmedDescription,
                },
                token
            );

            if (data.success) {
                setMessage(data.message || "Report submitted successfully. Thank you for keeping campus safe.");

                setTimeout(() => {
                    navigate("/posts");
                }, 1500);
            }
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to submit report"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 6, md: 8 } }}>
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        border: "1px solid #E2E8F0",
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "10px",
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                                color: "#EF4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ReportProblemOutlinedIcon />
                        </Box>
                        <Typography variant="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 800 }}>
                            Report Post
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                        Help community moderators maintain safety and academic guidelines.
                    </Typography>

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
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <FormControl fullWidth error={Boolean(errors.reason)} disabled={loading}>
                            <InputLabel id="report-reason-label">Reason *</InputLabel>
                            <Select
                                labelId="report-reason-label"
                                name="reason"
                                value={formData.reason}
                                label="Reason *"
                                onChange={handleChange}
                            >
                                <MenuItem value="SPAM">Spam</MenuItem>
                                <MenuItem value="HARASSMENT">Harassment or Bullying</MenuItem>
                                <MenuItem value="INAPPROPRIATE">Inappropriate Content</MenuItem>
                                <MenuItem value="OTHER">Other Reason</MenuItem>
                            </Select>
                            {errors.reason && (
                                <FormHelperText>{errors.reason}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            label="Detailed Explanation *"
                            name="description"
                            placeholder="Explain why this content violates community guidelines..."
                            value={formData.description}
                            onChange={handleChange}
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                            disabled={loading}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            color="error"
                            sx={{ py: 1.25 }}
                        >
                            {loading ? "Submitting Report..." : "Submit Report"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ReportPost;