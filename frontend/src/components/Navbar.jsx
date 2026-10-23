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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
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
    const isAdmin = user?.role === "ADMIN";

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate("/login");
    };

    const navItems = isAdmin
        ? [
              { label: "Admin Dashboard", path: "/admin", icon: <DashboardOutlinedIcon fontSize="small" /> },
              { label: "Reports", path: "/admin/reports", icon: <FlagOutlinedIcon fontSize="small" /> },
              { label: "Complaints", path: "/admin/complaints", icon: <RateReviewOutlinedIcon fontSize="small" /> },
              { label: "Mentors", path: "/admin/mentors", icon: <PersonAddAlt1OutlinedIcon fontSize="small" /> },
          ]
        : isMentor
        ? [
              { label: "Mentor Workspace", path: "/mentor", icon: <DashboardOutlinedIcon fontSize="small" /> },
              { label: "Complaints", path: "/mentor/complaints", icon: <RateReviewOutlinedIcon fontSize="small" /> },
              { label: "Reports", path: "/mentor/reports", icon: <FlagOutlinedIcon fontSize="small" /> },
              { label: "Campus Feed", path: "/posts", icon: <ArticleOutlinedIcon fontSize="small" /> },
          ]
        : [
        { label: "Feed", path: "/posts", icon: <ArticleOutlinedIcon fontSize="small" /> },
        ...(isAuthenticated
            ? [
                  { label: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon fontSize="small" /> },
                  { label: "New Post", path: "/create-post", icon: <AddCircleOutlineIcon fontSize="small" /> },
                  ...(!isAdmin ? [{ label: "Raise Complaint", path: "/complaints/new", icon: <RateReviewOutlinedIcon fontSize="small" /> }] : []),
                  { label: "Notifications", path: "/notifications", icon: <NotificationsOutlinedIcon fontSize="small" /> },
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
                        to={isAdmin ? "/admin" : "/"}
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
                                background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 10px rgba(15, 118, 110, 0.25)",
                            }}
                        >
                            <CampaignIcon fontSize="small" />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                color: "#16324F",
                            }}
                        >
                            Campus<span style={{ color: "#0F766E" }}>Voice</span>
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
                                        color: isActive ? "#0F766E" : "#647B84",
                                        backgroundColor: isActive ? "rgba(15, 118, 110, 0.08)" : "transparent",
                                        fontWeight: isActive ? 700 : 500,
                                        px: 1.75,
                                        py: 0.75,
                                        borderRadius: "10px",
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? "rgba(15, 118, 110, 0.12)"
                                                : "rgba(241, 245, 249, 0.9)",
                                            color: isActive ? "#115E59" : "#16324F",
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
                                            bgcolor: isMentor ? "#2B5D73" : "#0F766E",
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
                                                bgcolor: isMentor ? "rgba(43, 93, 115, 0.1)" : "rgba(15, 118, 110, 0.1)",
                                                color: isMentor ? "#244A5D" : "#0F766E",
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
                                        color: "#647B84",
                                        borderRadius: "8px",
                                        border: "1px solid #DCE6E3",
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
                        sx={{ display: { md: "none" }, color: "#16324F" }}
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
                                borderLeft: "1px solid #DCE6E3",
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
                                        background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
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
                                    bgcolor: "#F3F7F6",
                                    border: "1px solid #DCE6E3",
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
                                        bgcolor: isMentor ? "#2B5D73" : "#0F766E",
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
                                            bgcolor: isMentor ? "rgba(43, 93, 115, 0.1)" : "rgba(15, 118, 110, 0.1)",
                                            color: isMentor ? "#244A5D" : "#0F766E",
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
                                                color: isActive ? "#0F766E" : "#3E5664",
                                                "&.Mui-selected": {
                                                    bgcolor: "rgba(15, 118, 110, 0.08)",
                                                    "&:hover": { bgcolor: "rgba(15, 118, 110, 0.12)" },
                                                },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36, color: isActive ? "#0F766E" : "#647B84" }}>
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
