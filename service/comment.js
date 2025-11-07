const Comment = require("../models/Comment");

const getComments = ({ postId }) => {
  return Comment.find({ postId }).populate({ path: "userId", select: "username photo" });
};

const commentService = async ({ userId, postId, body }) => {
  const comment = new Comment({ userId, postId, body });

  await comment.save();

  const populated = Comment.findById(comment._id).populate({
    path: "userId",
    select: "username photo",
  });

  return populated;
};

module.exports = {
  getComments,
  commentService,
};
