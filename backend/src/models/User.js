const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("STUDENT", "MENTOR"),
      allowNull: false,
      defaultValue: "STUDENT",
    },

    anonymousHandle: {
      type: DataTypes.STRING,
      allowNull: true, // null for rows created before this field was added
      unique: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
