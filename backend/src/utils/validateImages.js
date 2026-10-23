const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const SIGNATURES = {
  "image/jpeg": (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (bytes) => bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
};

const validateImages = (images) => {
  if (images === undefined) return { images: [], error: null };
  if (!Array.isArray(images) || images.length > MAX_IMAGES) {
    return { error: `Attach up to ${MAX_IMAGES} photos.` };
  }

  for (const image of images) {
    if (typeof image !== "string") return { error: "One of the photos is invalid." };
    const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!match) return { error: "Photos must be JPG, PNG, or WebP images." };
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > MAX_IMAGE_BYTES) return { error: "Each photo must be 2 MB or smaller." };
    if (!SIGNATURES[match[1]](bytes)) return { error: "A photo's contents do not match its file type." };
  }
  return { images, error: null };
};

module.exports = { validateImages, MAX_IMAGES, MAX_IMAGE_BYTES };
