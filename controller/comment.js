const { getComments, commentService } = require("../service/comment");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

/* upload new comment */
const uploadComment = tryCatch(async (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    throw error("Invalid data", 400);
  }

  const comment = await commentService({ userId, postId, body });
  return res.status(200).json({ message: "Commented successfully", comment });
});

/* get comments by post id */
const getCommentByPostId = tryCatch(async (req, res) => {
  const { postId } = req.params;

  const comments = await getComments({ postId });

  return res.status(200).json(comments);
});

module.exports = {
  uploadComment,
  getCommentByPostId,
};
