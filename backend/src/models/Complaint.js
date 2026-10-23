const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Complaint = sequelize.define("Complaint", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  images: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  status: {
    type: DataTypes.ENUM("PENDING", "REVIEWED", "RESOLVED"),
    allowNull: false,
    defaultValue: "PENDING",
  },
}, { tableName: "complaints", timestamps: true });

module.exports = Complaint;
