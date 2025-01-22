const { uploadPost, getPosts } = require("../controller/post");
const router = require("express").Router();

router.post("/", uploadPost);
router.get("/", getPosts);

module.exports = router;
