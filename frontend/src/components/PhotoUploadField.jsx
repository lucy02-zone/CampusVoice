import { useRef, useState } from "react";
import { Alert, Box, Button, IconButton, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";

const MAX_PHOTOS = 3;
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const PhotoUploadField = ({ images, onChange, disabled = false }) => {
    const inputRef = useRef(null);
    const [error, setError] = useState("");

    const handleFiles = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        setError("");
        if (images.length + files.length > MAX_PHOTOS) {
            setError(`You can attach up to ${MAX_PHOTOS} photos.`);
            return;
        }
        const invalid = files.find((file) => !ACCEPTED.includes(file.type) || file.size > MAX_BYTES);
        if (invalid) {
            setError(invalid.size > MAX_BYTES ? "Each photo must be 2 MB or smaller." : "Choose JPG, PNG, or WebP photos.");
            return;
        }
        try {
            const dataUrls = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            })));
            onChange([...images, ...dataUrls]);
        } catch {
            setError("Unable to read one of those photos. Please try again.");
        }
    };

    return (
        <Box>
            <input ref={inputRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFiles} />
            <Button variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={() => inputRef.current?.click()} disabled={disabled || images.length >= MAX_PHOTOS}>
                Add photos ({images.length}/{MAX_PHOTOS})
            </Button>
            <Typography variant="caption" display="block" sx={{ color: "#647B84", mt: 0.5 }}>JPG, PNG, or WebP · up to 2 MB each</Typography>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            {!!images.length && (
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1.5 }}>
                    {images.map((image, index) => (
                        <Box key={`${index}-${image.slice(0, 24)}`} sx={{ position: "relative", width: 96, height: 76 }}>
                            <Box component="img" src={image} alt={`Photo attachment ${index + 1}`} sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1.5, border: "1px solid #DCE6E3" }} />
                            <IconButton aria-label={`Remove photo ${index + 1}`} size="small" onClick={() => onChange(images.filter((_, photoIndex) => photoIndex !== index))} disabled={disabled} sx={{ position: "absolute", top: 2, right: 2, bgcolor: "#fff", "&:hover": { bgcolor: "#ECF2F0" } }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PhotoUploadField;
