const { getAllUser, sendfdRequest, acceptFdRequest, findByProperty } = require("../service/user");
const tryCatch = require("../utils/catch-async");

const allUser = tryCatch(async (_req, res) => {
  /**
   * -TODO: filter, sort, pagination, select
   */

  const users = await getAllUser();

  return res.status(200).json(users);
});

const getCurrentUser = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const currentUser = await findByProperty("_id", userId);
  console.log(user);
  return res.status(200).json(currentUser);
});

/* Send friend request */
const sendFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  console.log(id);
  console.log(friendId);

  if (id === friendId) {
    throw error("You can't send a request to yourself!", 400);
  }

  const response = await sendfdRequest(id, friendId);
  console.log(response);
  res.status(200).json(response);
});

const acceptFriendRequest = tryCatch(async (req, res) => {
  const id = req.user._id;
  const { friendId } = req.params;

  const user = await acceptFdRequest(id, friendId);
  res.status(200).json(user);
});

module.exports = {
  allUser,
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
};
