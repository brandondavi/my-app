const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: [true, 'Email already exists'],
		trim: true, // removes trailing whitespace
		lowercase: true, // convertsto lowercase before saving to DB
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
			'Please add valid email'
		]
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		select: false // when we search for a user, don't return the password by default
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	passkey: {
		type: String
	},
	passwordResetToken: {
		type: String
	},
	passwordResetExpires: {
		type: Date
	},
	likedCharacters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Character'
	}]
});

// apparently next() is no longer needed in Mongoose 5.0
UserSchema.pre('save', async function() {
	if (!this.isModified('password')) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);