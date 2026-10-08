import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const Posts = () => {
    const [posts, setPosts] = useState([]);
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
                    error.response?.data?.message ||
                    "Failed to load posts"
                );
            }
        };

        loadPosts();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    CampusVoice Posts
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {posts.length === 0 ? (
                    <Alert severity="info">
                        No posts available.
                    </Alert>
                ) : (
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
                    ))
                )}
            </Box>
        </Container>
    );
};

export default Posts;