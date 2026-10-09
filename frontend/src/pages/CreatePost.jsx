import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SendIcon from "@mui/icons-material/Send";

import { createPost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const POPULAR_CATEGORIES = ["Academics", "Facilities", "Housing", "Events", "Safety", "General"];

const CreatePost = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleSelectCategory = (cat) => {
        setFormData((prev) => ({
            ...prev,
            category: cat,
        }));
        if (errors.category) {
            setErrors((prev) => ({ ...prev, category: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const trimmedTitle = formData.title.trim();
        const trimmedContent = formData.content.trim();
        const trimmedCategory = formData.category.trim();

        const validationErrors = {};
        if (!trimmedTitle) {
            validationErrors.title = "Title is required";
        }
        if (!trimmedContent) {
            validationErrors.content = "Content is required";
        }
        if (!trimmedCategory) {
            validationErrors.category = "Category is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const data = await createPost(
                {
                    title: trimmedTitle,
                    content: trimmedContent,
                    category: trimmedCategory,
                },
                token
            );

            if (data.success) {
                navigate("/posts");
            }
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to create post"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
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
                                bgcolor: "rgba(79, 70, 229, 0.1)",
                                color: "#4F46E5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SecurityOutlinedIcon />
                        </Box>
                        <Typography variant="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.875rem" }, fontWeight: 800 }}>
                            Create Anonymous Post
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ color: "#64748B", mb: 4, pl: 7 }}>
                        Share your thoughts, suggestions, or concerns. Your real identity is never displayed.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
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
                        <TextField
                            label="Title"
                            name="title"
                            placeholder="Summarize your concern or idea..."
                            value={formData.title}
                            onChange={handleChange}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                            disabled={loading}
                            required
                            fullWidth
                        />

                        <Box>
                            <TextField
                                label="Category"
                                name="category"
                                placeholder="Select or type a category (e.g. Academics, Facilities)..."
                                value={formData.category}
                                onChange={handleChange}
                                error={Boolean(errors.category)}
                                helperText={errors.category}
                                disabled={loading}
                                required
                                fullWidth
                            />
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                                    Suggestions:
                                </Typography>
                                {POPULAR_CATEGORIES.map((cat) => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        size="small"
                                        onClick={() => handleSelectCategory(cat)}
                                        sx={{
                                            bgcolor: formData.category === cat ? "rgba(79, 70, 229, 0.12)" : "#F1F5F9",
                                            color: formData.category === cat ? "#4F46E5" : "#64748B",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: "rgba(79, 70, 229, 0.15)" },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <TextField
                            label="Content"
                            name="content"
                            placeholder="Provide full details of your post..."
                            value={formData.content}
                            onChange={handleChange}
                            error={Boolean(errors.content)}
                            helperText={errors.content}
                            disabled={loading}
                            required
                            multiline
                            rows={6}
                            fullWidth
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                endIcon={loading ? null : <SendIcon />}
                                sx={{ py: 1.25, px: 4 }}
                            >
                                {loading ? "Publishing..." : "Publish Post"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreatePost;