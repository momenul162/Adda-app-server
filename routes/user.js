const {
  allUser,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  getUserById,
  updateUserProfile,
} = require("../controller/user");

const authenticate = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const { userUpdateSchema } = require("../schemas/authSchema");
const router = require("express").Router();

// Get all users
router.get("/users", authenticate, allUser);

// Get current authenticated user
router.get("/current-user", authenticate, getCurrentUser);

// Get user by ID
router.get("/users/:userId", authenticate, getUserById);

// Update current user profile (no need for userId in params)
router.patch("/users/me", authenticate, validateRequest(userUpdateSchema), updateUserProfile);

// Send friend request
router.post("/friend-request/:friendId", authenticate, sendFriendRequest);

// Accept friend request
router.post("/accept-request/:friendId", authenticate, acceptFriendRequest);

module.exports = router;
