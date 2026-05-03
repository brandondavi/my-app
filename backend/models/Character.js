const mongoose = require('mongoose');


const validTags = ["Educational", "Language", "History", "Coding", "Adventure", "Anime", "Fantasy", "Sci-Fi", "Romance", "Gaming", "Historical"];

const characterSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    name: { 
        type: String, 
        required: [true, 'Please add a name'] 
    },
    description: { 
        type: String, 
        required: [true, 'Please add a description']
    },
    systemPrompt: {
        type: String,
        required: [true, 'Please add a system prompt']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isPrivate: {
        type: Boolean,
        default: false,
        index: true
    },
    language: {
        type: String,
        default: 'en'
    },
    likeCount: {
        type: Number,
        default: 0,
        index: true
    },
    messageCount: {
        type: Number,
        default: 0,
        index: true
    },
    tags: {
        type: [String],
        required: true,
        enum: validTags,
        index: true
    }
});

module.exports = mongoose.model('Character', characterSchema);