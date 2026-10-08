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

const CreatePost = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
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
            const data = await createPost(formData, token);

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
                            required
                            fullWidth
                        />

                        <TextField
                            label="Content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
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