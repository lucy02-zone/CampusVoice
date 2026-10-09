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
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";

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
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F8FAFC", py: { xs: 4, md: 6 } }}>
            <Container maxWidth="md">
                {/* Page Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 800 }}>
                            Campus Feed
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
                            Browse and discover anonymous posts submitted by students.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/create-post"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ px: 2.5, py: 1.25, borderRadius: "10px" }}
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
                            py: 8,
                        }}
                    >
                        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 4,
                            border: "1px solid #E2E8F0",
                            borderRadius: "14px",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", sm: "row" },
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Search by title or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: "#94A3B8" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <FormControl sx={{ minWidth: { xs: "100%", sm: 220 } }}>
                                <InputLabel id="category-filter-label">Category</InputLabel>
                                <Select
                                    labelId="category-filter-label"
                                    value={selectedCategory}
                                    label="Category"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                                        </InputAdornment>
                                    }
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
                    </Paper>
                )}

                {!loading && !error && posts.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                            borderRadius: "16px",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <ArticleOutlinedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            No posts available yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
                            Be the first to share your campus experience or concern anonymously.
                        </Typography>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/create-post"
                            startIcon={<AddIcon />}
                        >
                            Create First Post
                        </Button>
                    </Paper>
                )}

                {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            textAlign: "center",
                            border: "1px solid #E2E8F0",
                            borderRadius: "16px",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            No matching posts found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                            Try searching for another keyword or clearing your category filters.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("ALL");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Paper>
                )}

                {!loading &&
                    !error &&
                    filteredPosts.map((post) => (
                        <Card
                            key={post.id}
                            elevation={0}
                            sx={{
                                mb: 3,
                                border: "1px solid #E2E8F0",
                                borderRadius: "16px",
                                bgcolor: "#FFFFFF",
                                transition: "all 180ms ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 24px -6px rgba(15, 23, 42, 0.06)",
                                    borderColor: "#CBD5E1",
                                },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 1.5,
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component={Link}
                                        to={`/posts/${post.id}`}
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1.25rem",
                                            color: "#0F172A",
                                            textDecoration: "none",
                                            "&:hover": { color: "#4F46E5" },
                                        }}
                                    >
                                        {post.title}
                                    </Typography>

                                    {post.category && (
                                        <Chip
                                            label={post.category}
                                            size="small"
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
                                        gap: 2,
                                        mb: 2,
                                        color: "#64748B",
                                        fontSize: "0.8125rem",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <SecurityOutlinedIcon sx={{ fontSize: 16, color: "#4F46E5" }} />
                                        <span>Author: <strong>{post.anonymousId || "Anonymous"}</strong></span>
                                    </Box>

                                    {post.createdAt && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </Box>
                                    )}
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "#334155",
                                        mb: 2,
                                        lineHeight: 1.6,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {post.content}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                                    <Button
                                        component={Link}
                                        to={`/posts/${post.id}`}
                                        variant="outlined"
                                        size="small"
                                        endIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                                    >
                                        Read & Discuss
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
            </Container>
        </Box>
    );
};

export default Posts;