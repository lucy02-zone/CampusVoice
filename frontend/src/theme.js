import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4F46E5", // Indigo 600
            light: "#6366F1",
            dark: "#4338CA",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#0EA5E9", // Sky 500
            light: "#38BDF8",
            dark: "#0284C7",
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
            default: "#F8FAFC",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#0F172A", // Slate 900
            secondary: "#64748B", // Slate 500
            disabled: "#94A3B8", // Slate 400
        },
        divider: "#E2E8F0",
    },
    typography: {
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#0F172A",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0F172A",
        },
        h3: {
            fontSize: "1.625rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0F172A",
        },
        h4: {
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "#0F172A",
        },
        h5: {
            fontSize: "1.125rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#0F172A",
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#0F172A",
        },
        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: "#334155",
        },
        body2: {
            fontSize: "0.84375rem",
            lineHeight: 1.5,
            color: "#64748B",
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
                    backgroundColor: "#F8FAFC",
                    color: "#0F172A",
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
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #4338CA 0%, #3730A3 100%)",
                    },
                },
                outlined: {
                    borderColor: "#E2E8F0",
                    color: "#334155",
                    "&:hover": {
                        borderColor: "#CBD5E1",
                        backgroundColor: "#F1F5F9",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
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
                    borderColor: "#E2E8F0",
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
                        borderColor: "#E2E8F0",
                    },
                    "&:hover fieldset": {
                        borderColor: "#CBD5E1",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#4F46E5",
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
                    color: "#0F172A",
                    boxShadow: "none",
                    borderBottom: "1px solid #E2E8F0",
                },
            },
        },
    },
});

export default theme;