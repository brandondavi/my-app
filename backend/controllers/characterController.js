const { deleteConversation } = require('../controllers/conversationController');
const axios = require('axios');

// to test with postman, you can send a POST request to http://localhost:5000/api/character/chat with a JSON body like this:
const Character = require('../models/Character');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

exports.createCharacter = async (req, res) => {
    try {
        const character = await Character.create({
            ...req.body,
            creator: req.user._id
        }); 

        res.status(201).json({ success: true, character: character });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCharacter = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ success: false, error: "Character not found" });
        }

        res.status(200).json({ success: true, data: character });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }

};
exports.deleteCharacter = async (req, res) => {
    try {
    
        const character = await Character.findById(req.params.id);

        if (!character) { return res.status(404).json({ success: false, error: "Character Not Found"}) }

        if (character.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: "Unauthorized deletion request." })
        }

        await Message.deleteMany({ conversation: req.params.id });
        await Conversation.deleteMany({ character: req.params.id });
        await Character.deleteOne({ _id: req.params.id });

        res.status(201).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getAllCharacters = async (req, res) => {
    
    try {
        const { tags, search, sort } = req.query;

        const visibilityRule = {
            // MongoDB OR operator
            $or: [
                { isPrivate: false },
                ...(req.user ? [{ creator: req.user.id }] : [])
            ]
        };

        let queryRules = [visibilityRule];

        if (tags) {
            const tagArray = tags.split(',');
            
            queryRules.push({ tags: { $all: tagArray } });
        }
        
        if (search) {
            queryRules.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { title: { $regex: search, $options: 'i' } }
                ]
            });
        }

        const masterQuery = { $and: queryRules }; // AND on all the queryRules
        
        let sortLogic = { createdAt: -1 };

        if (sort === 'oldest') {
            sortLogic = { createdAt: 1 };
        } else if (sort === 'newest') {
            sortLogic = { createdAt: -1 };
        } else if (sort === 'popular') {
            sortLogic = { likeCount: -1 };
        } else if (sort === 'messageCount') {
            sortLogic = { messageCount: -1 };
        }
        
        const characters = await Character.find(masterQuery).sort(sortLogic);

        res.status(200).json({ success: true, data: characters });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getAllMyCharacters = async (req, res) => {
    try {

        const { tags, search, visibility } = req.query;

        let queryRules = [];
        
        if (visibility === "all" || !visibility) {
            queryRules.push({ creator: req.user.id });
        } else if (visibility === "public") {
            queryRules.push({ isPrivate: false }, { creator: req.user.id });
        } else if (visibility === "private") {
            queryRules.push({ isPrivate: true }, { creator: req.user.id });
        }

        if (tags) {
            const tagArray = tags.split(',');
            queryRules.push({ tags: { $all: tagArray } });
        }
        
        if (search) {
            queryRules.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            });
        }

        const masterQuery = { $and: queryRules };

        const characters = await Character.find(masterQuery).sort({ createdAt: -1 });

        if (characters.length === 0) {
            return res.status(404).json({ success: false, error: "No characters found" });
        }

        res.status(200).json({ success: true, data: characters });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


exports.likeCharacter = async (req, res) => {
    try {
        const userId = req.user._id;
        const characterId = req.body.characterId;
        
        const user = await User.findById(userId);
        const character = await Character.findById(characterId);
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (!character) {
            console.log('character not found');
            return res.status(404).json({ success: false, error: 'Character not found' });
        }
        if (user.likedCharacters.includes(characterId)) {
            console.log('character already liked');
            character.likeCount--;
            user.likedCharacters.pull(characterId);
        } else {
            console.log('liking character');
            character.likeCount++;

            console.log('character liked numerically')

            user.likedCharacters.push(characterId);
            console.log('user character liked');
        }
    
        await user.save({ validateBeforeSave: false });
        await character.save({ validateBeforeSave: false });
        console.log('like/unlike saved successfully');
        res.status(200).json({ success: true, data: character });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAvailableTags = (req, res) => {
    const tags = ["Educational", "Language", "History", "Coding", "Adventure", "Anime", "Fantasy", "Sci-Fi", "Romance", "Gaming", "Historical"];
    res.status(200).json({ success: true, data: tags });
}

