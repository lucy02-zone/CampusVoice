import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";

import { getPosts } from "../api/postApi";
import { getApiErrorMessage } from "../api/apiError";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await getPosts();

                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (error) {
                setError(
                    getApiErrorMessage(error, "Failed to load posts")
                );
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5, mb: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography variant="h4">
                        CampusVoice Posts
                    </Typography>

                    <Button
                        variant="contained"
                        component={Link}
                        to="/create-post"
                    >
                        Create Post
                    </Button>
                </Box>

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            my: 5,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && posts.length === 0 && (
                    <Paper
                        sx={{
                            p: 5,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No posts available.
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Be the first to share your campus experience!
                        </Typography>

                        <Button
                            variant="contained"
                            component={Link}
                            to="/create-post"
                            sx={{ mt: 1 }}
                        >
                            Create Post
                        </Button>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    posts.map((post) => (
                        <Card key={post.id} sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {post.title}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                >
                                    {post.content}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Category: {post.category}
                                </Typography>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    to={`/posts/${post.id}`}
                                >
                                    View Post
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
            </Box>
        </Container>
    );
};

export default Posts;