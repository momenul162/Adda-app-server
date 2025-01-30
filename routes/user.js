const { allUser, getCurrentUser } = require("../controller/user");
const authenticate = require("../middleware/authentication");
const router = require("express").Router();

router.get("/users", authenticate, allUser);
router.get("/current-user", authenticate, getCurrentUser);

module.exports = router;
