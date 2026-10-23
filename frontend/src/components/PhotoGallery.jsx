import { Box } from "@mui/material";

const PhotoGallery = ({ images = [] }) => {
    if (!Array.isArray(images) || images.length === 0) return null;
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            {images.map((image, index) => (
                <Box key={index} component="a" href={image} target="_blank" rel="noreferrer" sx={{ display: "block", width: { xs: "calc(50% - 6px)", sm: 180 }, height: { xs: 130, sm: 140 }, overflow: "hidden", borderRadius: 2, border: "1px solid #DCE6E3" }}>
                    <Box component="img" src={image} alt={`Attached photo ${index + 1}`} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </Box>
            ))}
        </Box>
    );
};

export default PhotoGallery;
