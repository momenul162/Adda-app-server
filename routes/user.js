const { allUser, getCurrentUser } = require("../controller/user");
const router = require("express").Router();

router.get("/", allUser);
router.get("/:userId", getCurrentUser);

module.exports = router;
