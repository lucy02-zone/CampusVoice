"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "images", { type: Sequelize.JSONB, allowNull: false, defaultValue: [] });
    await queryInterface.addColumn("complaints", "images", { type: Sequelize.JSONB, allowNull: false, defaultValue: [] });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("complaints", "images");
    await queryInterface.removeColumn("posts", "images");
  },
};
