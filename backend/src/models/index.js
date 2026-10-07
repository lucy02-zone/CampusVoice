const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Vote = require("./Vote");
const Notification = require("./Notification");
const ComplaintResponse = require("./ComplaintResponse");
const Report = require("./Report");

// User → Posts
User.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

// Post → Comments
Post.hasMany(Comment, {
  foreignKey: "postId",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
});

// User → Comments
User.hasMany(Comment, {
  foreignKey: "userId",
});

Comment.belongsTo(User, {
  foreignKey: "userId",
});

// Post → Votes
Post.hasMany(Vote, {
  foreignKey: "postId",
});

Vote.belongsTo(Post, {
  foreignKey: "postId",
});

// User → Votes
User.hasMany(Vote, {
  foreignKey: "userId",
});

Vote.belongsTo(User, {
  foreignKey: "userId",
});

// User → Notifications
User.hasMany(Notification, {
  foreignKey: "userId",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
});

// Post → Reports
Post.hasMany(Report, {
  foreignKey: "postId",
});

Report.belongsTo(Post, {
  foreignKey: "postId",
});

// User → Reports
User.hasMany(Report, {
  foreignKey: "userId",
});

Report.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Post,
  Comment,
  Vote,
  Notification,
  ComplaintResponse,
  Report,
};
