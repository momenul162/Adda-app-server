const { postService, getAllPost } = require("../service/post");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

const uploadPost = tryCatch(async (req, res) => {
  const { userId, media, body } = req.body;

  if (!userId) {
    throw error("Invalid data or user", 400);
  }

  const post = await postService({ userId, media, body });

  return res.status(200).json({ message: "Uploaded successfully", post });
});

const getPosts = tryCatch(async (_req, res) => {
  const posts = await getAllPost();
  return res.status(200).json(posts);
});

module.exports = {
  uploadPost,
  getPosts,
};
