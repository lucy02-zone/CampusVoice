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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

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
    const [voteMessage, setVoteMessage] = useState("");
    const [voting, setVoting] = useState(false);
    const [votingType, setVotingType] = useState(null);

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

    const handleVote = async (type) => {
        if (voting) return;

        setActionError("");
        setVoteMessage("");
        setVoting(true);
        setVotingType(type);

        try {
            const response = await votePost(
                {
                    postId: post.id,
                    voteType: type,
                },
                token
            );

            if (response.success) {
                setVoteMessage(response.message || "Vote recorded successfully");
            }
        } catch (error) {
            setActionError(
                getApiErrorMessage(error, "Failed to submit vote")
            );
        } finally {
            setVoting(false);
            setVotingType(null);
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
            <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: 8 }}>
                <Container maxWidth="md">
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: 6 }}>
                <Container maxWidth="md">
                    <Button
                        component={Link}
                        to="/posts"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 3 }}
                    >
                        Back to Posts
                    </Button>
                    <Alert severity="error" sx={{ borderRadius: "12px" }}>
                        {error || "Post not found"}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 6 } }}>
            <Container maxWidth="md">
                <Button
                    component={Link}
                    to="/posts"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 3, color: "#64748B" }}
                >
                    Back to Posts
                </Button>

                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2,
                                gap: 2,
                            }}
                        >
                            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "1.5rem", md: "1.875rem" }, fontWeight: 800, color: "#0F172A" }}>
                                {post.title}
                            </Typography>

                            {post.category && (
                                <Chip
                                    label={post.category}
                                    sx={{
                                        bgcolor: "rgba(79, 70, 229, 0.08)",
                                        color: "#4F46E5",
                                        fontWeight: 700,
                                        borderRadius: "6px",
                                    }}
                                />
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2.5,
                                mb: 3,
                                color: "#64748B",
                                fontSize: "0.875rem",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <SecurityOutlinedIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                                <span>Author: <strong>{post.anonymousId || "Anonymous"}</strong></span>
                            </Box>

                            {post.createdAt && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                    <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                    <span>Posted on {formatDate(post.createdAt)}</span>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3.5 }} />

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                lineHeight: 1.7,
                                color: "#334155",
                                fontSize: "1rem",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {post.content}
                        </Typography>

                        {voteMessage && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>
                                {voteMessage}
                            </Alert>
                        )}

                        {actionError && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                                {actionError}
                            </Alert>
                        )}

                        {isAuthenticated && (
                            <Box sx={{ mb: 4, display: "flex", gap: 1.5, alignItems: "center" }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleVote("UPVOTE")}
                                    disabled={voting}
                                    startIcon={
                                        votingType === "UPVOTE" ? (
                                            <CircularProgress size={16} color="inherit" />
                                        ) : (
                                            <ThumbUpOutlinedIcon />
                                        )
                                    }
                                >
                                    Upvote
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => handleVote("DOWNVOTE")}
                                    disabled={voting}
                                    startIcon={
                                        votingType === "DOWNVOTE" ? (
                                            <CircularProgress size={16} color="inherit" />
                                        ) : (
                                            <ThumbDownOutlinedIcon />
                                        )
                                    }
                                >
                                    Downvote
                                </Button>
                            </Box>
                        )}

                        <Divider sx={{ mb: 4 }} />

                        <CommentSection postId={post.id} />
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default PostDetail;