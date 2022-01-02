const { validationResult, body } = require("express-validator");
const Post = require("../models/Post");
const uploadImage = require("../helpers/helpers");

exports.imgUpload = async (req, res, next) => {
  try {
    const myFile = req.file;
    console.log(myFile);
    // const reader = new global.FileReader();
    // const fileBytes = [];
    // const fileObj = {};
    // reader.readAsArrayBuffer(myFile);
    // reader.onloadend = (evt) => {
    //   if (evt.target.readyState === FileReader.DONE) {
    //     const arrayBuffer = evt.target.result;

    //     const array = new Uint8Array(arrayBuffer);
    //     for (const a of array) {
    //       fileBytes.push(a);
    //     }
    //     fileObj = {
    //       originalName: myFile.name,
    //       mimetype: myFile.type,
    //       buffer: fileBytes,
    //       size: myFile.size,
    //     };
    //   }
    // };
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
