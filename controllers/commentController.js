const { validationResult, body } = require("express-validator");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.createComment = async (req, res, next) => {
  try {
    // let id;
    var comment = new Comment({
      user: req.body.user,
      comment: req.body.comment,
      post: req.body.post,
    })
      .save()
      .then(async (comment) => {
        console.log(comment);
        // id = comment._id;
        await Post.findByIdAndUpdate(
          req.body.post,
          { $push: { comments: comment._id } },
          { safe: true, upsert: false, new: true }
        ).then((res) => {
          console.log(res);
        });
      });
    res.status(200).json(comment);
  } catch (err) {
    console.log(err);
  }
};
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postid }).populate(
      "user"
    );
    console.log(comments);
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
