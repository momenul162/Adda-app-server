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

module.exports = { registerSchema, loginSchema };
