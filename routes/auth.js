const router = require("express").Router();
const { registerController, loginController } = require("../controller/auth");
const validateRequest = require("../middleware/validateRequest");
const { registerSchema, loginSchema } = require("../schemas/authSchema");

router.post("/sign-up", validateRequest(registerSchema), registerController);

router.post("/sign-in", validateRequest(loginSchema), loginController);

module.exports = router;
