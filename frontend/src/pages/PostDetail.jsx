import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Typography,
} from "@mui/material";

import { getPosts } from "../api/postApi";
import CommentSection from "../components/CommentSection";
import { votePost } from "../api/voteApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/apiError";

const PostDetail = () => {
    const { id } = useParams();
    const { token, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            setError("");
            try {
                const postData = await getPosts();

                if (postData.success) {
                    const foundPost = postData.posts.find(
                        (item) => item.id === Number(id)
                    );

                    if (!foundPost) {
                        setError("Post not found");
                        return;
                    }

                    setPost(foundPost);
                }
            } catch (error) {
                setError(
                    getApiErrorMessage(error, "Failed to load post")
                );
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    const handleVote = async (voteType) => {
        setActionError("");
        try {
            await votePost(
                {
                    postId: post.id,
                    voteType,
                },
                token
            );
        } catch (error) {
            setActionError(
                getApiErrorMessage(error, "Failed to submit vote")
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "";
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !post) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 5 }}>
                    <Button
                        component={Link}
                        to="/posts"
                        variant="outlined"
                        sx={{ mb: 3 }}
                    >
                        ← Back to Posts
                    </Button>
                    <Alert severity="error">
                        {error || "Post not found"}
                    </Alert>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 5 }}>
                <Button
                    component={Link}
                    to="/posts"
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    ← Back to Posts
                </Button>

                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2,
                                gap: 2,
                            }}
                        >
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                {post.title}
                            </Typography>

                            {post.category && (
                                <Chip
                                    label={post.category}
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 3,
                                color: "text.secondary",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Author: <strong>{post.anonymousId || "Anonymous"}</strong>
                            </Typography>

                            {post.createdAt && (
                                <Typography variant="body2" color="text.secondary">
                                    Posted on: {formatDate(post.createdAt)}
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                lineHeight: 1.7,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {post.content}
                        </Typography>

                        {actionError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {actionError}
                            </Alert>
                        )}

                        {isAuthenticated && (
                            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleVote("UPVOTE")}
                                >
                                    👍 Upvote
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => handleVote("DOWNVOTE")}
                                >
                                    👎 Downvote
                                </Button>
                            </Box>
                        )}

                        <Divider sx={{ mb: 4 }} />

                        <CommentSection postId={post.id} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default PostDetail;