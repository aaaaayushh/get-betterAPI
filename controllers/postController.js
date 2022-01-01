const { validationResult, body } = require("express-validator");
const Post = require("../models/Post");
exports.createPost = [
  body("caption", "Field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    } else {
      var post = new Post({
        user: req.body.user,
        likes: [],
        comments: [],
        caption: req.body.caption,
        image: req.body.image,
      });
      try {
        await post.save();
        res.status(201).json(post);
      } catch (err) {
        res.status(409).json({ message: error });
      }
    }
  },
];
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
