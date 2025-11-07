const { uploadComment, getCommentByPostId } = require("../controller/comment");
const router = require("express").Router();

router.post("/", uploadComment);
router.get("/:postId", getCommentByPostId);

module.exports = router;
