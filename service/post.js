const Post = require("../models/Post");
const error = require("../utils/error");
const { findByProperty } = require("./user");

/* Find one by post property */
const findByPostProperty = (key, value) => {
  if (key == "_id") {
    return Post.findById(value);
  }
  return Post.findOne({ [key]: value });
};

/* Post server using POST method */
const postService = async ({ userId, image, video, body, visibility }) => {
  const user = await findByProperty("_id", userId);

  if (!user) {
    throw error("Unauthorized", 400);
  }

  const newPost = new Post({ userId, image, video, body, visibility });
  return newPost.save();
};

/* Handle user reaction */
const toggleReaction = async (postId, userId, action) => {
  const alreadyLiked = post.likes.includes(userId);
  const alreadyDisliked = post.dislikes && post.dislikes.includes(userId); // Check if dislikes exist

  if (alreadyLiked) {
    // Remove like
    post.likes = post.likes.filter((id) => id !== userId);
  } else {
    // Add like and remove dislike (if any)
    post.likes.push(userId);
    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter((id) => id !== userId);
    }
  }
};

/* Get all post */
const getAllPost = () => {
  return Post.find().populate({ path: "userId", select: "username photo country" });
};

module.exports = {
  findByPostProperty,
  postService,
  getAllPost,
  toggleReaction,
};
