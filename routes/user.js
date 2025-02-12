const {
  allUser,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
} = require("../controller/user");
const authenticate = require("../middleware/authentication");
const router = require("express").Router();

router.get("/users", authenticate, allUser);
router.get("/current-user", authenticate, getCurrentUser);
router.post("/friend-request/:friendId", authenticate, sendFriendRequest);
router.post("/accept-request/:friendId", authenticate, acceptFriendRequest);

module.exports = router;
