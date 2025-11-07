const router = require("express").Router();
const {
  uploadPost,
  getPosts,
  updatePost,
  getPostById,
  reactionController,
  deletePostById,
} = require("../controller/post");
const authenticate = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const { createPostSchema, updatePostSchema, reactionSchema } = require("../schemas/postSchema");

router.get("/", authenticate, getPosts);

router.get("/:postId", authenticate, getPostById);

router.post("/", authenticate, validateRequest(createPostSchema), uploadPost);

router.delete("/:postId", authenticate, deletePostById);

router.patch("/:postId", authenticate, validateRequest(updatePostSchema), updatePost);

router.patch("/:postId/react", authenticate, validateRequest(reactionSchema), reactionController);

module.exports = router;
