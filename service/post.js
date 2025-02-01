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

  await newPost.save();

  const populated = await Post.findById(newPost._id).populate({
    path: "userId",
    select: "username photo country",
  });

  return populated;
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
