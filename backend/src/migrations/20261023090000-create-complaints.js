"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("complaints", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: "users", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE",
      },
      subject: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM("PENDING", "REVIEWED", "RESOLVED"), allowNull: false, defaultValue: "PENDING" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("complaints");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_complaints_status";');
  },
};
