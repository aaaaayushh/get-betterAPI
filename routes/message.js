const express = require("express");
var router = express.Router();
var messageController = require("../controllers/messageController");

router.post("/createMessage", messageController.storeMessage);
router.get("/getMessages/:senderId/:recvId", messageController.getMessages);
module.exports = router;
