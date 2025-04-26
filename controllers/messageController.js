const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.startConversation = async (req, res) => {
  const { receiverId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [req.user._id, receiverId]
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error starting conversation' });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id
    }).populate('members', 'name email profilePicture'); // Optional: show user info

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};


exports.sendMessage = async (req, res) => {
    const { conversationId, text } = req.body;
  
    try {
      const newMessage = new Message({
        conversationId,
        sender: req.user._id,
        text
      });
  
      await newMessage.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  };

  // Get messages from a conversation
exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;
  
    try {
      const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  };