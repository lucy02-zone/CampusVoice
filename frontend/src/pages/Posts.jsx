import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { getPosts } from "../api/postApi";
import { getApiErrorMessage } from "../api/apiError";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

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

    const categories = [
        "ALL",
        ...Array.from(
            new Set(posts.map((post) => post.category).filter(Boolean))
        ),
    ];

    const filteredPosts = posts.filter((post) => {
        const query = searchQuery.trim().toLowerCase();

        const matchesSearch =
            !query ||
            post.title?.toLowerCase().includes(query) ||
            post.content?.toLowerCase().includes(query);

        const matchesCategory =
            selectedCategory === "ALL" ||
            post.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

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

                {!loading && !error && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 3,
                            flexDirection: { xs: "column", sm: "row" },
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Search Posts"
                            placeholder="Search by title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                            <InputLabel id="category-filter-label">Category</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                value={selectedCategory}
                                label="Category"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <MenuItem value="ALL">All Categories</MenuItem>
                                {categories
                                    .filter((cat) => cat !== "ALL")
                                    .map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
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

                {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No posts found.
                        </Typography>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("ALL");
                            }}
                            sx={{ mt: 1 }}
                        >
                            Clear Filters
                        </Button>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    filteredPosts.map((post) => (
                        <Card key={post.id} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 1.5,
                                        gap: 1,
                                    }}
                                >
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                        {post.title}
                                    </Typography>

                                    {post.category && (
                                        <Chip
                                            label={post.category}
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        mb: 2,
                                        color: "text.secondary",
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        Author: <strong>{post.anonymousId || "Anonymous"}</strong>
                                    </Typography>

                                    {post.createdAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(post.createdAt)}
                                        </Typography>
                                    )}
                                </Box>

                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    sx={{
                                        mb: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {post.content}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to={`/posts/${post.id}`}
                                    size="small"
                                >
                                    View Post
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
            </Box>
        </Container>
    );
};

export default Posts;