const User = require("../models/User");
const error = require("../utils/error");

const findByProperty = (key, value) => {
  if (key == "_id") {
    return User.findById(value)
      .populate("friends", "username email photo")
      .populate("friendRequests", "username email photo")
      .populate("sentRequests", "username email photo");
  }
  return User.findOne({ [key]: value });
};

const getAllUser = () => {
  return User.find();
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

  if (user || friend) throw error("User not found", 404);
  if (!user.friendRequests.includes(friendId)) throw error("No friend request found!");

  user.friend.push(friendId);
  friend.friend.push(userId);

  user.friendRequests = user.friendRequests.filter((id) => id.tostring() !== friendId);
  friend.sentRequests = friend.sentRequests.filter((id) => id.tostring() !== userId);

  await user.save();
  await friend.save();

  return { message: "Friend request accepted" };
};

module.exports = {
  findByProperty,
  getAllUser,
  sendfdRequest,
  acceptFdRequest,
};
