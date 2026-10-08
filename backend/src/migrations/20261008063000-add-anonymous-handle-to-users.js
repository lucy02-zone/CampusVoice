"use strict";

const crypto = require("crypto");

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

function generateAnonymousHandle(userId) {
  const secret = process.env.APP_ANON_SECRET || "campus-voice-anon-fallback";
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(String(userId))
    .digest("hex");
  const prefixIndex = parseInt(hmac.slice(0, 2), 16) % PREFIXES.length;
  return `${PREFIXES[prefixIndex]}-${hmac.slice(0, 8)}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the column as nullable first
    await queryInterface.addColumn("users", "anonymousHandle", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // 2. Backfill existing users
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM "users";'
    );

    for (const user of users) {
      const handle = generateAnonymousHandle(user.id);
      await queryInterface.sequelize.query(
        `UPDATE "users" SET "anonymousHandle" = :handle WHERE id = :id`,
        { replacements: { handle, id: user.id } }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "anonymousHandle");
  },
};
