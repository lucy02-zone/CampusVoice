import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
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

const CommentSection = ({ postId }) => {
    const { token, isAuthenticated } = useAuth();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const loadComments = async () => {
        try {
            const data = await getCommentsByPost(postId);

            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            setError("Failed to load comments");
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await createComment(
                {
                    postId,
                    content,
                },
                token
            );

            if (data.success) {
                setContent("");
                loadComments();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create comment"
            );
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Comments
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {comments.length === 0 ? (
                <Typography color="text.secondary">
                    No comments yet.
                </Typography>
            ) : (
                comments.map((comment) => (
                    <Paper
                        key={comment.id}
                        sx={{ p: 2, mb: 2 }}
                        elevation={1}
                    >
                        <Typography variant="body1">
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
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Write a comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={3}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Add Comment
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default CommentSection;