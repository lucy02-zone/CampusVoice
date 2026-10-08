import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";

import { getPosts } from "../api/postApi";
import CommentSection from "../components/CommentSection";
import { votePost } from "../api/voteApi";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
    const { id } = useParams();
    const { token, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
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
                    error.response?.data?.message ||
                    "Failed to load post"
                );
            }
        };

        loadPost();
    }, [id]);

    const handleVote = async (voteType) => {
        try {
            await votePost(
                {
                    postId: post.id,
                    voteType,
                },
                token
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit vote"
            );
        }
    };

    if (error && !post) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 5 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!post) {
        return (
            <Container maxWidth="md">
                <Typography sx={{ mt: 5 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {post.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mb: 3 }}
                        >
                            {post.content}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Category: {post.category}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {isAuthenticated && (
                            <Box sx={{ mb: 4 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleVote("UPVOTE")}
                                    sx={{ mr: 2 }}
                                >
                                    👍 Upvote
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handleVote("DOWNVOTE")
                                    }
                                >
                                    👎 Downvote
                                </Button>
                            </Box>
                        )}

                        <CommentSection postId={post.id} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default PostDetail;