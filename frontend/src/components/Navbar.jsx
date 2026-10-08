import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isMentor = user?.role === "MENTOR";

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate("/login");
    };

    const navItems = [
        { label: "Posts", path: "/posts" },
        ...(isAuthenticated
            ? [
                  { label: "Create Post", path: "/create-post" },
                  { label: "Notifications", path: "/notifications" },
                  ...(isMentor
                      ? [
                            { label: "Reports", path: "/admin/reports" },
                            { label: "Complaints", path: "/admin/complaint-responses" },
                        ]
                      : []),
              ]
            : [
                  { label: "Login", path: "/login" },
                  { label: "Register", path: "/register" },
              ]),
    ];

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 700,
                        flexGrow: 1,
                    }}
                >
                    CampusVoice
                </Typography>

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                        >
                            {item.label}
                        </Button>
                    ))}

                    {isAuthenticated && (
                        <>
                            {user?.role && (
                                <Chip
                                    label={user.role}
                                    size="small"
                                    color={isMentor ? "secondary" : "default"}
                                    sx={{ ml: 1, mr: 1, color: "white", borderColor: "white" }}
                                    variant="outlined"
                                />
                            )}
                            <Button color="inherit" onClick={handleLogout} variant="outlined" size="small">
                                Logout
                            </Button>
                        </>
                    )}
                </Box>

                {/* Mobile Menu Toggle */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{ display: { md: "none" }, fontSize: "1.5rem" }}
                >
                    ☰
                </IconButton>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{ sx: { width: 250 } }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            CampusVoice
                        </Typography>

                        {isAuthenticated && user && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {user.name || user.email}
                                </Typography>
                                <Chip
                                    label={user.role || "USER"}
                                    size="small"
                                    color={isMentor ? "secondary" : "default"}
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/"
                                onClick={handleDrawerToggle}
                            >
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>

                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {isAuthenticated && (
                            <>
                                <Divider sx={{ my: 1 }} />
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout}>
                                        <ListItemText
                                            primary="Logout"
                                            slotProps={{ primary: { color: "error.main" } }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;