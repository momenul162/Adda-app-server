const { z } = require("zod");

/* REGISTRATION SCHEMA */
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 11 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  photo: z.string().url("Photo must be a valid URL").optional(),
  country: z.string().min(2, "Country name must be at least 2 characters long"),
});

/* LOGIN SCHEMA */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userUpdateSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 character").optional(),
  email: z.string().email("Email must be valid").optional(),
  bio: z.string().max(250, "Bio must be up to 250 characters").optional(),
  phone: z.string().optional(),
  currentCity: z.string().optional(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  photo: z.string().url("Photo must be a valid URL").optional(),
  coverPhoto: z.string().url("Cover photo must be valid url").optional(),
});

module.exports = { registerSchema, loginSchema, userUpdateSchema };
