const User = require("../models/User");
const { registerService, loginService } = require("../service/auth");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

/* resister controller */
const registerController = tryCatch(async (req, res) => {
  const { username, email, phone, password, photo, country } = req.body;

  if (!username || !email || !phone || !password || !country) {
    throw error("Invalid data", 400);
  }

  const newUser = await registerService({
    username,
    email,
    phone,
    password,
    photo,
    country,
  });

  return res.status(200).json({ message: "User created successfully", newUser });
});

/* user login controller */
const loginController = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw error("Invalid data", 400);
  }

  const user = await loginService({ email, password });
  console.log(user);

  const populated = await User.findById(user._id)
    .populate("friends", "username email photo")
    .populate("friendRequests", "username email photo")
    .populate("sentRequests", "username email photo");

  return res.status(200).json({ message: "Login successfully", populated });
});

module.exports = {
  registerController,
  loginController,
};
