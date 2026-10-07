const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vote = sequelize.define(
  "Vote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    voteType: {
      type: DataTypes.ENUM("UPVOTE", "DOWNVOTE"),
      allowNull: false,
    },
  },
  {
    tableName: "votes",
    timestamps: true,
  }
);

module.exports = Vote;
