import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0F766E", // Deep teal
            light: "#14B8A6",
            dark: "#115E59",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#2B5D73", // Slate blue
            light: "#4F8792",
            dark: "#244A5D",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#10B981", // Emerald 500
            light: "#34D399",
            dark: "#059669",
        },
        warning: {
            main: "#F59E0B", // Amber 500
            light: "#FBBF24",
            dark: "#D97706",
        },
        error: {
            main: "#EF4444", // Rose 500
            light: "#F87171",
            dark: "#DC2626",
        },
        info: {
            main: "#3B82F6", // Blue 500
            light: "#60A5FA",
            dark: "#2563EB",
        },
        background: {
            default: "#F3F7F6",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#16324F", // Navy
            secondary: "#647B84", // Muted blue gray
            disabled: "#8EA2A7", // Muted gray
        },
        divider: "#DCE6E3",
    },
    typography: {
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#16324F",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#16324F",
        },
        h3: {
            fontSize: "1.625rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#16324F",
        },
        h4: {
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "#16324F",
        },
        h5: {
            fontSize: "1.125rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#16324F",
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#16324F",
        },
        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: "#3E5664",
        },
        body2: {
            fontSize: "0.84375rem",
            lineHeight: 1.5,
            color: "#647B84",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "-0.01em",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F3F7F6",
                    color: "#16324F",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "8px 18px",
                    fontSize: "0.875rem",
                    boxShadow: "none",
                    transition: "all 150ms ease-in-out",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(15, 118, 110, 0.15)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #115E59 0%, #134E4A 100%)",
                    },
                },
                outlined: {
                    borderColor: "#DCE6E3",
                    color: "#3E5664",
                    "&:hover": {
                        borderColor: "#C5D3D0",
                        backgroundColor: "#ECF2F0",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "1px solid #DCE6E3",
                    boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
                    backgroundImage: "none",
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: "none",
                },
                outlined: {
                    borderColor: "#DCE6E3",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    backgroundColor: "#FFFFFF",
                    "& fieldset": {
                        borderColor: "#DCE6E3",
                    },
                    "&:hover fieldset": {
                        borderColor: "#C5D3D0",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#0F766E",
                        borderWidth: 1.5,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(12px)",
                    color: "#16324F",
                    boxShadow: "none",
                    borderBottom: "1px solid #DCE6E3",
                },
            },
        },
    },
});

export default theme;
