import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { createReport } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

const ReportPost = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token } = useAuth();

    const postId = searchParams.get("postId");

    const [formData, setFormData] = useState({
        reason: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            const data = await createReport(
                {
                    postId,
                    reason: formData.reason,
                    description: formData.description,
                },
                token
            );

            if (data.success) {
                setMessage("Report submitted successfully");

                setTimeout(() => {
                    navigate("/posts");
                }, 1000);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit report"
            );
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
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <Select
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            displayEmpty
                            required
                        >
                            <MenuItem value="">
                                Select reason
                            </MenuItem>

                            <MenuItem value="SPAM">
                                Spam
                            </MenuItem>

                            <MenuItem value="HARASSMENT">
                                Harassment
                            </MenuItem>

                            <MenuItem value="INAPPROPRIATE">
                                Inappropriate Content
                            </MenuItem>

                            <MenuItem value="OTHER">
                                Other
                            </MenuItem>
                        </Select>

                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={5}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Submit Report
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ReportPost;