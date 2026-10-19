"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "isAnonymous", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn("posts", "authorName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("posts", "authorName");
    await queryInterface.removeColumn("posts", "isAnonymous");
  },
};
