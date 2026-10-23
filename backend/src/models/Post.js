const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    anonymousId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    authorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  },
  {
    tableName: "posts",
    timestamps: true,
  }
);

module.exports = Post;
