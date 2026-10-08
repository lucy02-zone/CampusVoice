import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    getCommentsByPost,
    createComment,
} from "../api/commentApi";

import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const CommentSection = ({ postId }) => {
    const { token, isAuthenticated } = useAuth();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState("");

    const loadComments = async () => {
        setError("");
        try {
            const data = await getCommentsByPost(postId);

            if (data.success) {
                setComments(data.comments);
            }
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load comments"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            loadComments();
        }
    }, [postId]);

    const handleChange = (e) => {
        setContent(e.target.value);
        if (inputError) {
            setInputError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setInputError("");

        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setInputError("Comment cannot be empty");
            return;
        }

        setSubmitting(true);

        try {
            const data = await createComment(
                {
                    postId,
                    content: trimmedContent,
                },
                token
            );

            if (data.success) {
                setContent("");
                await loadComments();
            }
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to create comment"));
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Comments ({comments.length})
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={32} />
                </Box>
            ) : comments.length === 0 ? (
                <Paper
                    variant="outlined"
                    sx={{ p: 3, textAlign: "center", backgroundColor: "action.hover" }}
                >
                    <Typography color="text.secondary">
                        No comments yet. Be the first to share your thoughts!
                    </Typography>
                </Paper>
            ) : (
                comments.map((comment) => (
                    <Paper
                        key={comment.id}
                        sx={{ p: 2, mb: 2 }}
                        elevation={1}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 600 }}
                            >
                                {comment.anonymousId || "Anonymous"}
                            </Typography>

                            {comment.createdAt && (
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(comment.createdAt)}
                                </Typography>
                            )}
                        </Box>

                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {comment.content}
                        </Typography>
                    </Paper>
                ))
            )}

            {isAuthenticated && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Write a comment..."
                            value={content}
                            onChange={handleChange}
                            error={Boolean(inputError)}
                            helperText={inputError}
                            disabled={submitting}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting}
                            >
                                {submitting ? "Posting..." : "Add Comment"}
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default CommentSection;