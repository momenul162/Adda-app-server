const { default: mongoose } = require("mongoose");
const { postService, getAllPost, findByPostProperty } = require("../service/post");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

/* upload a post */
const uploadPost = tryCatch(async (req, res) => {
  const { userId, image, video, body, visibility } = req.body;

  if (!userId) {
    throw error("Invalid data or user", 400);
  }

  const post = await postService({ userId, image, video, body, visibility });

  return res.status(200).json({ message: "Uploaded successfully", post });
});

/* Get all post controller*/
const getPosts = tryCatch(async (_req, res) => {
  const posts = await getAllPost();
  return res.status(200).json(posts);
});

const getPostById = tryCatch(async (req, res) => {
  const { postId } = req.params;
  const post = await findByPostProperty("_id", postId);
  return res.status(200).json(post);
});

/* post update controller */
const updatePost = tryCatch(async (req, res) => {
  const { postId } = req.params;
  const { body, visibility, image, video } = req.body;

  const post = await findByPostProperty("_id", postId);

  if (!post) {
    throw error("Post not found", 404);
  }

  post.body = body ?? post.body;
  post.visibility = visibility ?? post.visibility;
  post.image = image ?? post.image;
  post.video = video ?? post.video;

  await post.save();
  return res.status(200).json(post);
});

/* Reaction controller */
const reactionController = tryCatch(async (req, res) => {
  const { postId } = req.params;
  const { userId, type } = req.body;

  const post = await findByPostProperty("_id", postId).populate("userId", "username photo country");
  if (!post) {
    throw error("Post not found", 404);
  }

  if (type !== "like" && type !== "dislike") {
    throw error("Invalid reaction type. Must be 'like' or 'dislike'", 400);
  }

  const userIdObjectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

  const existLike = post.likes.some((id) => id.equals(userIdObjectId)); // Use .equals() for ObjectIds
  const existDislike = post.dislikes.some((id) => id.equals(userIdObjectId));

  if (type === "like") {
    if (existLike) {
      post.likes = post.likes.filter((id) => !id.equals(userIdObjectId));
    } else {
      post.likes.push(userIdObjectId);
      if (existDislike) {
        post.dislikes = post.dislikes.filter((id) => !id.equals(userIdObjectId));
      }
    }
  } else if (type === "dislike") {
    if (existDislike) {
      post.dislikes = post.dislikes.filter((id) => !id.equals(userIdObjectId));
    } else {
      post.dislikes.push(userIdObjectId);
      if (existLike) {
        post.likes = post.likes.filter((id) => !id.equals(userIdObjectId));
      }
    }
  }

  await post.save();
  return res.status(200).json(post);
});

module.exports = {
  getPosts,
  getPostById,
  uploadPost,
  updatePost,
  reactionController,
};
