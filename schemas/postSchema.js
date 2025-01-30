const { z } = require("zod");

/* CREATE POST FROM USER */
const createPostSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  body: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIEND"]).optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  video: z.string().url("Video must be a valid URL").optional(),
});

/* UPDATE POST FROM USER */
const updatePostSchema = z.object({
  body: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIEND"]).optional(),
  image: z.string().url().optional(),
  video: z.string().url().optional(),
});

/* REACTION HANDLER SCHEMA */
const reactionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(["like", "dislike"]),
});

module.exports = { createPostSchema, updatePostSchema, reactionSchema };
