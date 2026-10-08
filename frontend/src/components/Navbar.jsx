import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        color: "white",
                        textDecoration: "none",
                        flexGrow: 1,
                    }}
                >
                    CampusVoice
                </Typography>

                <Box>
                    <Button color="inherit" component={Link} to="/posts">
                        Posts
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/create-post"
                            >
                                Create Post
                            </Button>

                            <Button
                                color="inherit"
                                component={Link}
                                to="/notifications"
                            >
                                Notifications
                            </Button>

                            {user?.role === "MENTOR" && (
                                <>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/admin/reports"
                                    >
                                        Reports
                                    </Button>

                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/admin/complaint-responses"
                                    >
                                        Complaints
                                    </Button>
                                </>
                            )}

                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>

                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;