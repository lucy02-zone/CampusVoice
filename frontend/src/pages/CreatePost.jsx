import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { createPost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

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
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Create Anonymous Post
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Share your campus experience without revealing
                        your identity.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
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
                            value={formData.title}
                            onChange={handleChange}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                            disabled={loading}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Content"
                            name="content"
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

                        <TextField
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            error={Boolean(errors.category)}
                            helperText={errors.category}
                            disabled={loading}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Create Post"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default CreatePost;