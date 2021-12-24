const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.signupInfo = async (req, res, next) => {
  const filter = { username: req.body.username };
  const update = { firstname: req.body.firstname, lastname: req.body.lastname };
  const user = await User.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });
  return user;
};

exports.signup = [
  body("username", "Empty name")
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
          throw new Error("username already in use");
        }
      } catch (err) {
        throw new Error(err);
      }
    }),
  async (req, res, next) => {
    passport.authenticate("signup", { session: false }, (err, user, info) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          username: req.body.username,
          errors: errors.array(),
        });
      }
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ user: body }, process.env.SECRET, {
        expiresIn: "1d",
      });
      return res.json({
        message: "signup successful",
        user: req.user,
        token,
      });
    })(req, res, next);
  },
];

exports.login = async (req, res, next) => {
  passport.authenticate(
    "login",
    {
      successRedirect: "http://localhost:3001",
      failureRedirect: "http://localhost:3001/login",
      failureFlash: true,
    },
    async (err, user, info) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.send({ success: false, message: "authentication failed" });
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          const body = { _id: user._id, username: user.username };
          const token = jwt.sign({ user: body }, process.env.SECRET, {
            expiresIn: "1d",
          });
          return res.json({ user, token });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};

exports.logout = function (req, res) {
  try {
    req.logout();
    return res.json({ msg: "logout done" });
    // res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

exports.googleLogin = async function (req, res) {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) return;
  else {
    const user = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    await User.create(user).then((res) => {
      return res.json({ user });
    });
  }
};
exports.googleSignup = async function (req, res, next) {
  console.log("on google signup");
  const existingUser = await User.findOne({ username: req.body.username });
  console.log(existingUser);
  if (existingUser) return;
  else {
    const user = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    await User.create(user).then((res) => {
      // console.log(res);
      return res.json({ user });
    });
  }
};
