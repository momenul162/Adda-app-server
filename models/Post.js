const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media: {
    type: String,
  },
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  visibility: {
    type: String,
    enum: ["PUBLIC", "PRIVATE", "FRIEND"],
    default: "PUBLIC",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Post = model("Post", postSchema);
module.exports = Post;
