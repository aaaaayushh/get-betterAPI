const express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

//custom auth
router.post("/signup", userController.signup);
router.post("/signupInfo", userController.signupInfo);
router.post("/login", userController.login);
router.post("/googlelogin", userController.googleLogin);
router.post("/googleSignup", userController.googleSignup);
router.get("/logout", userController.logout);

module.exports = router;
