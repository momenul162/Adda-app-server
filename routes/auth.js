const router = require("express").Router();
const { registerController, loginController } = require("../controller/auth");

router.post("/sign-up", registerController);
router.post("/sign-in", loginController);

module.exports = router;
