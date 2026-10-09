import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

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
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <ChatBubbleOutlineIcon sx={{ color: "#4F46E5", fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    Discussion ({comments.length})
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={30} sx={{ color: "#4F46E5" }} />
                </Box>
            ) : comments.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: "12px",
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No comments yet. Be the first to join the conversation!
                    </Typography>
                </Paper>
            ) : (
                comments.map((comment) => (
                    <Paper
                        key={comment.id}
                        elevation={0}
                        sx={{
                            p: 2.5,
                            mb: 2,
                            border: "1px solid #E2E8F0",
                            borderRadius: "12px",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        bgcolor: "rgba(79, 70, 229, 0.1)",
                                        color: "#4F46E5",
                                    }}
                                >
                                    A
                                </Avatar>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                                    {comment.anonymousId || "Anonymous"}
                                </Typography>
                            </Box>

                            {comment.createdAt && (
                                <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                                    {formatDate(comment.createdAt)}
                                </Typography>
                            )}
                        </Box>

                        <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#334155", pl: 4.25 }}>
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
                            label="Add to discussion..."
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
                                endIcon={submitting ? null : <SendIcon fontSize="small" />}
                            >
                                {submitting ? "Posting..." : "Post Comment"}
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default CommentSection;