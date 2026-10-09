import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
        { label: "Feed", path: "/posts", icon: <ArticleOutlinedIcon fontSize="small" /> },
        ...(isAuthenticated
            ? [
                  { label: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon fontSize="small" /> },
                  { label: "New Post", path: "/create-post", icon: <AddCircleOutlineIcon fontSize="small" /> },
                  { label: "Notifications", path: "/notifications", icon: <NotificationsOutlinedIcon fontSize="small" /> },
                  ...(isMentor
                      ? [
                            { label: "Reports", path: "/admin/reports", icon: <FlagOutlinedIcon fontSize="small" /> },
                            { label: "Complaints", path: "/admin/complaint-responses", icon: <RateReviewOutlinedIcon fontSize="small" /> },
                        ]
                      : []),
              ]
            : [
                  { label: "Log in", path: "/login", icon: <LoginOutlinedIcon fontSize="small" /> },
                  { label: "Register", path: "/register", icon: <PersonAddOutlinedIcon fontSize="small" /> },
              ]),
    ];

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: "space-between" }}>
                    {/* Brand Logo */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.25)",
                            }}
                        >
                            <CampaignIcon fontSize="small" />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                color: "#0F172A",
                            }}
                        >
                            Campus<span style={{ color: "#4F46E5" }}>Voice</span>
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.75 }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    sx={{
                                        color: isActive ? "#4F46E5" : "#64748B",
                                        backgroundColor: isActive ? "rgba(79, 70, 229, 0.08)" : "transparent",
                                        fontWeight: isActive ? 700 : 500,
                                        px: 1.75,
                                        py: 0.75,
                                        borderRadius: "10px",
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? "rgba(79, 70, 229, 0.12)"
                                                : "rgba(241, 245, 249, 0.9)",
                                            color: isActive ? "#4338CA" : "#0F172A",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}

                        {isAuthenticated && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
                                <Divider orientation="vertical" flexItem sx={{ height: 24, my: "auto" }} />
                                
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar
                                        sx={{
                                            width: 34,
                                            height: 34,
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            bgcolor: isMentor ? "#0EA5E9" : "#4F46E5",
                                            color: "#FFFFFF",
                                        }}
                                    >
                                        {getInitials(user?.name || user?.email)}
                                    </Avatar>
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.2 }}>
                                            {user?.name || "User"}
                                        </Typography>
                                        <Chip
                                            label={user?.role || "STUDENT"}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                bgcolor: isMentor ? "rgba(14, 165, 233, 0.1)" : "rgba(79, 70, 229, 0.1)",
                                                color: isMentor ? "#0284C7" : "#4F46E5",
                                                mt: 0.25,
                                                "& .MuiChip-label": { px: 0.75 },
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <IconButton
                                    onClick={handleLogout}
                                    size="small"
                                    sx={{
                                        color: "#64748B",
                                        borderRadius: "8px",
                                        border: "1px solid #E2E8F0",
                                        p: 0.75,
                                        "&:hover": {
                                            color: "#EF4444",
                                            borderColor: "#FCA5A5",
                                            bgcolor: "#FEF2F2",
                                        },
                                    }}
                                    title="Logout"
                                >
                                    <LogoutOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    {/* Mobile Menu Toggle */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: "none" }, color: "#0F172A" }}
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>

                    {/* Mobile Drawer */}
                    <Drawer
                        anchor="right"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        PaperProps={{
                            sx: {
                                width: 280,
                                p: 2,
                                borderLeft: "1px solid #E2E8F0",
                                background: "#FFFFFF",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "8px",
                                        background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    <CampaignIcon fontSize="small" />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    CampusVoice
                                </Typography>
                            </Box>
                            <IconButton onClick={handleDrawerToggle} size="small">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {isAuthenticated && user && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    bgcolor: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                    mb: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: isMentor ? "#0EA5E9" : "#4F46E5",
                                        fontWeight: 700,
                                    }}
                                >
                                    {getInitials(user.name || user.email)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, truncate: true }}>
                                        {user.name || "User"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                                        {user.email}
                                    </Typography>
                                    <Chip
                                        label={user.role || "STUDENT"}
                                        size="small"
                                        sx={{
                                            mt: 0.5,
                                            height: 18,
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            bgcolor: isMentor ? "rgba(14, 165, 233, 0.1)" : "rgba(79, 70, 229, 0.1)",
                                            color: isMentor ? "#0284C7" : "#4F46E5",
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <List sx={{ px: 0 }}>
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                                        <ListItemButton
                                            component={Link}
                                            to={item.path}
                                            onClick={handleDrawerToggle}
                                            selected={isActive}
                                            sx={{
                                                borderRadius: "10px",
                                                color: isActive ? "#4F46E5" : "#334155",
                                                "&.Mui-selected": {
                                                    bgcolor: "rgba(79, 70, 229, 0.08)",
                                                    "&:hover": { bgcolor: "rgba(79, 70, 229, 0.12)" },
                                                },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36, color: isActive ? "#4F46E5" : "#64748B" }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}

                            {isAuthenticated && (
                                <>
                                    <Divider sx={{ my: 1.5 }} />
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={handleLogout}
                                            sx={{
                                                borderRadius: "10px",
                                                color: "#EF4444",
                                                "&:hover": { bgcolor: "#FEF2F2" },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36, color: "#EF4444" }}>
                                                <LogoutOutlinedIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Drawer>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;