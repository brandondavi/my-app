const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Character = require('../models/Character');
const axios = require('axios');



exports.sendMessage = async (req, res) => {
	try { 

		const { conversationId, content } = req.body;
		
		const conversation = await Conversation.findById(conversationId);
		if (!conversation) {return res.status(404).json({success: false, error: "Conversation not found" });}


		const character = await Character.findById(conversation.character);
		if (!character) {return res.status(404).json({success: false, error: "Character not found" });}

		await Message.create({
			conversation: conversationId,
			role: 'user',
			content: content
		});

		const recentMessages = await Message.find({ conversation: conversationId })
			.sort({ createdAt: -1 }) 
			.limit(10);

		const pastMessages = recentMessages.reverse();


		const apiMessages = [
			{ role: "system", content: character.systemPrompt },
			...pastMessages.map(msg => ({ role: msg.role, content: msg.content }))
		];
		
		const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
			model: "google/gemma-4-31b-it:free",
			messages: apiMessages
		}, {
			headers: {
				"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
				"Content-Type": "application/json"
			}
		});
		
		const aiContent = response.data.choices[0].message.content;
		
		const aiMessage = await Message.create({
			conversation: conversationId,
			role: 'assistant',
			content: aiContent
		});

		character.messageCount++;
		await character.save({ validateBeforeSave: false });
	
		res.status(201).json({success: true, data: aiMessage });
		
	} catch (error) {
		console.error("openrouter ai error");
		res.status(500).json({success: false, error: "Failed to send message" });
	}
};