const User = require("../models/User");
const error = require("../utils/error");

const findByProperty = (key, value) => {
  if (key == "_id") {
    return User.findById(value);
  }
  return User.findOne({ [key]: value });
};

const getAllUser = async () => {
  const users = await User.find()
    .populate("friends", "username email photo")
    .populate("friendRequests", "username email photo")
    .populate("sentRequests", "username email photo");

  return users;
};

const updateUserService = async (userId, updatedData) => {
  // Convert dateOfBirth to Date format if provided

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true, // Return updated document
  });

  if (!updatedUser) throw error("User not found", 404);

  return updatedUser;
};

const sendfdRequest = async (userId, friendId) => {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) throw error("User not found", 404);
  if (user.friends.includes(friendId)) throw error("Already friend!", 400);
  if (user.sentRequests.includes(friendId)) throw error("Request already sent!", 400);

  user.sentRequests.push(friend);
  friend.friendRequests.push(userId);

  await user.save();
  await friend.save();

  return { message: "Friend request sent!" };
};

const acceptFdRequest = async (userId, friendId) => {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) throw error("User not found", 404);
  if (!user.friendRequests.includes(friendId)) throw error("No friend request found!");

  user.friends.push(friendId);
  user.friendRequests.pull(friendId);
  friend.friends.push(userId);
  friend.sentRequests.pull(userId);

  await user.save();
  await friend.save();

  return { message: "Friend request accepted" };
};

module.exports = {
  findByProperty,
  getAllUser,
  updateUserService,
  sendfdRequest,
  acceptFdRequest,
};
