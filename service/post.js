const Post = require("../models/Post");
const User = require("../models/User");
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
const postService = async ({ userId, media, body }) => {
  const user = await findByProperty("_id", userId);

  if (!user) {
    throw error("Unauthorized", 400);
  }

  const newPost = new Post({ userId, media, body });
  return newPost.save();
};

/* Get all post */
const getAllPost = () => {
  return Post.find().populate({ path: "userId", select: "username photo country" });
};

module.exports = {
  findByPostProperty,
  postService,
  getAllPost,
};
