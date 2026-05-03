

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversationMessages = async (req, res) => {
    try {
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, error: "Conversation not found" });
        }

        const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });        
    }
};

exports.startOrGetConversation = async (req, res) => {
    try {
        const { characterId } = req.body;

        let conversation = await Conversation.findOne({ 
            user: req.user._id, 
            character: characterId
        });
        
        if (!conversation) {
            conversation = await Conversation.create({
                user: req.user._id,
                character: characterId
            });
        }
        console.log(`starting or getting ${conversation}`);
        res.status(200).json({ success: true, data: conversation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.startNewConversation = async (req, res) => {
    try {
        const { characterId } = req.body;

        const conversation = await Conversation.create({
                user: req.user._id,
                character: characterId
            });
        
        res.status(201).json({ success: true, data: conversation._id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) { 
            return res.status(404).json({ success: false, error: "Conversation not found" })
        }

        if (conversation.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: "Unauthorized deletion request." })
        }

        await Message.deleteMany({ conversation: req.params.id }); // delete all 
        await conversation.deleteOne(); // delete the conversation itself

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};