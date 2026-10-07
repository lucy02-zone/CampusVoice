"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("complaint_responses", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      complaintId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      response: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("PENDING", "REVIEWED", "RESOLVED"),
        allowNull: false,
        defaultValue: "PENDING",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("complaint_responses");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_complaint_responses_status";'
    );
  },
};