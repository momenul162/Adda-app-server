const User = require("../models/User");
const error = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByProperty } = require("./user");

/* user register service */
const registerService = async ({ username, email, phone, password, photo, country, isActive }) => {
  let user = await findByProperty("email", email);
  if (user) {
    throw error("User already exists", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  user = new User({ username, email, phone, password: hash, photo, country, isActive });

  return user.save();
};

/* user login service */
const loginService = async ({ email, password }) => {
  const user = await findByProperty("email", email);
  if (!user) {
    throw error("Invalid Credential", 400);
  }
  console.log(user);
  const isValid = await bcrypt.compare(password, user.password);
  console.log(isValid);

  if (!isValid) {
    throw error("Invalid Credential", 400);
  }

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    password: user.password,
    photo: user.photo,
    country: user.country,
    isActive: user.isActive,
  };

  const token = jwt.sign(payload, "secret-key", { expiresIn: "7d" });

  return {
    user: payload,
    token,
  };
};

module.exports = {
  registerService,
  loginService,
};
