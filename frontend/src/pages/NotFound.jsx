import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
} from "@mui/material";

const NotFound = () => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 10,
                    textAlign: "center",
                }}
            >
                <Typography variant="h2" gutterBottom>
                    404
                </Typography>

                <Typography variant="h5" gutterBottom>
                    Page Not Found
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    The page you are looking for does not exist.
                </Typography>

                <Button
                    variant="contained"
                    component={Link}
                    to="/"
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;