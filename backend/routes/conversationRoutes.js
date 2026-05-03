const express = require('express');
const router = express.Router();

const { getConversationMessages, startOrGetConversation, startNewConversation, deleteConversation } = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startOrGetConversation);
router.post('/new', protect, startNewConversation);

router.get('/:id/messages', protect, getConversationMessages)

router.delete('/:id', protect, deleteConversation);

module.exports = router;