const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	character: {
		type: mongoose.Schema.ObjectId,
		ref: 'Character',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Conversation', ConversationSchema);