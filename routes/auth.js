const express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();
const passport = require("passport");

//custom auth
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

//google auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: "An error occurred!",
    function(req, res) {
      res.json("google login done");
    },
  })
);
module.exports = router;
