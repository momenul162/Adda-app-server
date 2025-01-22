const { getAllUser } = require("../service/user");
const tryCatch = require("../utils/catch-async");

const allUser = tryCatch(async (_req, res) => {
  /**
   * -TODO: filter, sort, pagination, select
   */

  const users = await getAllUser();

  return res.status(200).json(users);
});

// const getCurrentUser = tryCatch(async (req, res) => {
//   const currentUser = req.user;
//   return res.status(200).json(currentUser);
// });

module.exports = {
  allUser,
  getCurrentUser,
};
