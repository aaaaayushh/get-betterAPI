const Message = require("../models/Message");

exports.storeMessage = async (req, res) => {
  try {
    var message = new Message({
      sender: req.body.sender,
      receiver: req.body.receiver,
      body: req.body.message,
    }).save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: error });
  }
};

exports.getMessages = async (req, res) => {
  try {
    var msgs = await Message.find({
      sender: req.params.senderId,
      receiver: req.params.recvId,
    });
    var msgs2 = await Message.find({
      sender: req.params.recvId,
      receiver: req.params.senderId,
    });
    msgs = msgs.concat(msgs2);
    console.log(msgs);
    msgs.sort((a, b) => {
      const d1 = new Date(a.created);
      const d2 = new Date(b.created);
      if (d1.getTime() > d2.getTime()) return 1;
      else if (d1.getTime() < d2.getTime()) return -1;
      else return 0;
    });
    res.status(200).json({ msgs });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
