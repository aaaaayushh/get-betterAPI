const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.signupInfo = async (req, res, next) => {
  const filter = { username: req.body.username };
  const update = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    profilePic: req.body.profilePic,
  };
  const user = await User.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });
  return res.status(200).json({ user });
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
  }
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
      console.log(user);
      return res.json({
        message: "signup successful",
        user: user,
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
  if (existingUser) return res.json(existingUser);
  else {
    const user = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      googleId: req.body.googleId,
      profilePic: req.body.profilePic,
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
      googleId: req.body.googleId,
      profilePic: req.body.profilePic,
    };
    await User.create(user).then((res) => {
      // console.log(res);
      return res.json({ user });
    });
  }
};

exports.addFriend = async function (req, res, next) {
  try {
    const res1 = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { friends: req.body.userid } },
      { safe: true, upsert: false, new: true }
    );
    const res2 = await User.findByIdAndUpdate(
      req.body.userid,
      { $push: { friends: req.params.id } },
      { safe: true, upsert: false, new: true }
    );
    return res.status(200).json({ res1, res2 });
  } catch (err) {
    console.log(err);
  }
};

exports.searchUser = async function (req, res, next) {
  try {
    const users = await User.find({
      firstname: { $regex: new RegExp(req.params.name, "i") },
      _id: { $nin: req.params.userid },
    });
    console.log(users);
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProfilePic = async function (req, res) {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.id,
      {
        profilePic: req.body.picUrl,
      },
      { safe: true, upsert: false, new: true }
    );
    console.log(result);
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};
