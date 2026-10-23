"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS \'ADMIN\';'
    );
  },

  // PostgreSQL enum values are intentionally retained on rollback because existing
  // users may already have the ADMIN role and dropping it would require data loss.
  async down() {},
};
