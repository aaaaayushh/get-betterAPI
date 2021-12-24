const express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();
const passport = require("passport");

//custom auth
router.post("/signup", userController.signup);
router.post("/signupInfo", userController.signupInfo);
router.post("/login", userController.login);
router.post("/googlelogin", userController.googleLogin);
router.post("/googleSignup", userController.googleSignup);
router.get("/logout", userController.logout);

//google auth
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureFlash: "An error occurred!",
//     function(req, res) {
//       res.json("google login done");
//     },
//   })
// );
// router.post("/google", userController.googleLogin);
module.exports = router;
