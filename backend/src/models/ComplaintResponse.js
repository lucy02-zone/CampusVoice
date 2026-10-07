const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ComplaintResponse = sequelize.define(
  "ComplaintResponse",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "REVIEWED", "RESOLVED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "complaint_responses",
    timestamps: true,
  }
);

module.exports = ComplaintResponse;
