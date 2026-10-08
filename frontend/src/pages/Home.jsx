import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 8 }}>
                <Paper sx={{ p: 5, textAlign: "center" }}>
                    <Typography variant="h3" gutterBottom>
                        CampusVoice
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        A safe space for students to share their campus
                        experiences anonymously.
                    </Typography>

                    {isAuthenticated ? (
                        <>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                Welcome, {user.name}
                            </Typography>

                            <Button
                                variant="contained"
                                component={Link}
                                to="/posts"
                                sx={{ mr: 2 }}
                            >
                                View Posts
                            </Button>

                            <Button
                                variant="outlined"
                                component={Link}
                                to="/create-post"
                                sx={{ mr: 2 }}
                            >
                                Create Post
                            </Button>

                            <Button
                                variant="text"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/login"
                                sx={{ mr: 2 }}
                            >
                                Login
                            </Button>

                            <Button
                                variant="outlined"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default Home;