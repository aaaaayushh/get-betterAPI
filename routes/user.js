const express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/getUser/:id", userController.getUser);
router.post("/addFriend/:id", userController.addFriend);
router.get("/getFriends/:id", userController.getFriends);
router.get("/search/:userid/:name", userController.searchUser);
router.post("/updateDp", userController.updateProfilePic);
router.post("/mlData",userController.predictGetBetter);

module.exports = router;
