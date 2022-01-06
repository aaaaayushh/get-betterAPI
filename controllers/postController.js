const { validationResult, body } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");
const uploadImage = require("../helpers/helpers");

exports.imgUpload = async (req, res, next) => {
  try {
    const myFile = req.file;
    console.log(myFile);
    const imageUrl = await uploadImage(myFile);
    console.log(imageUrl);
    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
exports.createPost = [
  body("caption", "Field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    var op = {};
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    } else {
      try {
        var temp = await User.findOne({ username: req.body.user.email });
        op = temp[0];
        console.log(op);
      } catch (err) {
        console.log(err, "user not found");
        next();
      }
      try {
        var post = new Post({
          user: op,
          likes: [],
          comments: [],
          caption: req.body.caption,
          image: req.body.image,
        }).save();
        res.status(200).json(post);
      } catch (err) {
        res.status(409).json({ message: error });
      }
    }
  },
];
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .populate("likes")
      .populate("comments");

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
exports.likePost = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const result = await Post.findByIdAndUpdate(
      req.params.postid,
      { $push: { likes: user } },
      { safe: true, upsert: false, new: true }
    );
    return res.status(200).json({ message: "like inserted", result });
  } catch (err) {
    console.log(err);
  }
};
exports.unlikePost = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const result = await Post.findByIdAndUpdate(
      req.params.postid,
      { $pull: { likes: req.body.id } },
      { safe: true, new: true }
    );
    return res.status(200).json({ message: "unliked", result });
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
};
