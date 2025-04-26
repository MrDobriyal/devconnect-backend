const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  startConversation,
  getUserConversations
} = require('../controllers/messageController');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/start', protect, startConversation);
router.get('/conversations', protect, getUserConversations);
router.post('/send', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);

module.exports = router;