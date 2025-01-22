const { registerService, loginService } = require("../service/auth");
const tryCatch = require("../utils/catch-async");
const error = require("../utils/error");

/* resister controller */
const registerController = tryCatch(async (req, res) => {
  const { username, email, phone, password, photo, country, isActive } = req.body;

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
    isActive,
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

  return res.status(200).json({ message: "Login successfully", user });
});

module.exports = {
  registerController,
  loginController,
};
