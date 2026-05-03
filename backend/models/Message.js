const mongoose = require('mongoose');



const MessageSchema = new mongoose.Schema({

	conversation: {
		type: mongoose.Schema.ObjectId,
		ref: 'Conversation',
		required: true
	},
	role: {
		type: String,
		enum: ['user', 'assistant', 'system'],
		required: true
	},
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Message', MessageSchema); 