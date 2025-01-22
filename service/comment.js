const Comment = require("../models/Comment");
const Post = require("../models/Post");

const getComments = ({ id }) => {
  return Post.find({ postId: id }).populate({ path: "userId", select: "username" });
};

const commentService = ({ userId, postId, body }) => {
  const comment = new Comment({ userId, postId, body });
  return comment.save();
};

module.exports = {
  getComments,
  commentService,
};
