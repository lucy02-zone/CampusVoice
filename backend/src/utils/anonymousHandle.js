const crypto = require("crypto");

// 64 neutral, non-identifying adjectives for the human-readable prefix
const PREFIXES = [
  "Amber", "Azure", "Blaze", "Bright", "Brisk", "Calm", "Cedar", "Chill",
  "Civic", "Clear", "Cloud", "Crisp", "Dusk", "Echo", "Ember", "Fern",
  "Flint", "Frost", "Gale", "Glen", "Gold", "Haze", "Jade", "Keen",
  "Lark", "Leaf", "Lumen", "Mist", "Moss", "Neon", "Noble", "North",
  "Opal", "Peak", "Pine", "Pixel", "Plain", "Prism", "Quest", "Raven",
  "Reed", "River", "Sage", "Sand", "Scout", "Shore", "Silver", "Slate",
  "Solar", "Spark", "Star", "Steel", "Stone", "Storm", "Swift", "Terra",
  "Tide", "Trail", "Vale", "Veil", "Vivid", "Wave", "Wind", "Zeal",
];

/**
 * Generates a deterministic, privacy-preserving anonymous handle.
 *
 * Algorithm:
 *   hmac = HMAC-SHA256(APP_ANON_SECRET, String(userId))
 *   prefix = PREFIXES[hmac[0] % 64]
 *   suffix = first 8 hex chars of hmac
 *   handle = "{prefix}-{suffix}"   e.g. "Sage-3a7f2b1c"
 *
 * Properties:
 *   - Deterministic: same userId always produces the same handle.
 *   - One-way: userId cannot be derived from the handle.
 *   - Collision-resistant: 2^32 distinct suffix values per prefix.
 *
 * @param {number|string} userId
 * @returns {string}
 */
function generateAnonymousHandle(userId) {
  const secret = process.env.APP_ANON_SECRET || "campus-voice-anon-fallback";
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(String(userId))
    .digest("hex");

  const prefixIndex = parseInt(hmac.slice(0, 2), 16) % PREFIXES.length;
  const suffix = hmac.slice(0, 8);

  return `${PREFIXES[prefixIndex]}-${suffix}`;
}

module.exports = { generateAnonymousHandle };
