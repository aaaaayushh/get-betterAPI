const express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/getUser/:id", userController.getUser);
router.post("/addFriend/:id", userController.addFriend);
router.get("/search/:userid/:name", userController.searchUser);
router.post("/updateDp", userController.updateProfilePic);

module.exports = router;
