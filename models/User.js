const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
      },
      message: (prop) => `Invalid email: ${prop.value}`,
    },
  },
  photo: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxlength: 250,
    default: "",
  },
  password: {
    type: String,
    minlength: [6, "Password is too short"],
    required: true,
  },
  currentCity: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  occupation: {
    type: String,
  },
  isActive: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "INACTIVE",
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = model("User", userSchema);
module.exports = User;
