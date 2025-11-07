const User = require("../models/User");
const {
  getAllUser,
  sendfdRequest,
  acceptFdRequest,
  updateUserService,
  rejectFdRequest,
  cancelRequest,
} = require("../service/user");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

/* Get all users */
const allUser = tryCatch(async (_req, res) => {
  /**
   * -TODO: filter, sort, pagination, select
   */

  const users = await getAllUser();

  return res.status(200).json(users);
});

/* Get Current user */
const getCurrentUser = tryCatch(async (req, res) => {
  const userId = req.user._id;

  const currentUser = await User.findById(userId)
    .populate("friends", "username email photo")
    .populate("friendRequests", "username email photo")
    .populate("sentRequests", "username email photo");

  return res.status(200).json(currentUser);
});

/* Get user by id */
const getUserById = tryCatch(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .populate("friends", "username email photo")
    .populate("friendRequests", "username email photo")
    .populate("sentRequests", "username email photo");

  return res.status(200).json(user);
});

/* Update profile */
const updateUserProfile = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const updatedData = req.body;

  const updatedUser = await updateUserService(userId, updatedData);

  return res.status(200).json(updatedUser);
});

/* Send friend request */
const sendFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  if (id === friendId) {
    throw error("You can't send a request to yourself!", 400);
  }

  const response = await sendfdRequest(id, friendId);
  res.status(200).json(response);
});

/* Accept friend request */
const acceptFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  const response = await acceptFdRequest(id, friendId);
  res.status(200).json(response);
});

/* reject friend request */
const rejectFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  const response = await rejectFdRequest(id, friendId);
  res.status(200).json(response);
});

/* cancel friend request */
const cancelFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  const response = await cancelRequest(id, friendId);
  res.status(200).json(response);
});

module.exports = {
  allUser,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
