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
                setMessage(data.message || "Report submitted successfully");

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
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Report Post
                    </Typography>

                    {message && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
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
                                <MenuItem value="HARASSMENT">Harassment</MenuItem>
                                <MenuItem value="INAPPROPRIATE">Inappropriate Content</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </Select>
                            {errors.reason && (
                                <FormHelperText>{errors.reason}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            label="Description *"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                            disabled={loading}
                            multiline
                            rows={5}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Report"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ReportPost;