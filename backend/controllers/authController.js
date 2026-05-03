const User = require ('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const generatePasskey = require('../utils/generatePasskey');
const generateResetToken = require('../utils/generateResetToken');
const crypto = require('node:crypto');


exports.register = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;


		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ success: false, error: 'Email already exists' });
		}

		const passkey = generatePasskey();
		
		const user = await User.create({
			name,
			username,
			email,
			password,
			passkey
		});
		
		const message = `Welcome to my Chat app! Your 6-digit verification code is: ${passkey}\n\nThis code will expire soon.`;
		
		try {
			console.log(`Sending email to ${user.email} with content:\n${message}`);

			await sendEmail({
				email: user.email,
				subject: 'My Chat app - Verify Your Email',
				text: message
			});
			
			res.status(200).json({ success: true, message: "Verification email sent"});
			
			
		} catch (error) {
			await User.findByIdAndDelete(user._id);
			
			return res.status(500).json({ success: false, error: error.message });
		}

	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		
		if (!email || !password) {
			return res.status(400).json({success: false, error: 'Please provide an email and password'});
		}	
		
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return res.status(401).json({success: false, error: 'Invalid credential'})
		}
		
		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch) {
			return res.status(401).json({success: false, error: 'Invalid credential'})
		}
		
		const token = jwt.sign(
			{id: user._id},
			process.env.JWT_SECRET, 
			{expiresIn: process.env.JWT_EXPIRE}
		);
		
		res.status(200).json({success: true, token: token, data: {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt
		} });
		
	} catch (error) {
		res.status(500).json({success: false, error: error.message });
	}
};

exports.verifyEmail = async (req, res) => {
	try { 
		const { email, passkey } = req.body;
	
		const user = await User.findOne({email}).select('-password');;
		

		if (!user) {
			return res.status(404).json({ success: false, error: "User not found" });
		}		
		
		if (user.isVerified) {
			return res.status(400).json({ success: false, error: "User is already verified" });
		}
		
		if (user.passkey !== passkey) {
			return res.status(400).json({ success: false, error: "Invalid verification"});
		}
		
		user.isVerified = true;
		user.passkey = undefined;
		await user.save();
		
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '30d'});
		
		// Hand over the keys to the frontend
		res.status(200).json({
			success: true,
			token: token,
			data: user
		});
		
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
}

exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Server Error' });
	}
}


exports.forgotPassword = async (req, res) => {
	try {
		console.log(`starting forgotpassword function`);
		const { email } = req.body;

		const user = await User.findOne({email});

		if (!user) {
			// bad for security, should return OK
			return res.status(404).json({ success: false, error: "User not found" });
		}
		const tokenObject = generateResetToken();
		console.log(tokenObject.resetToken);

		user.passwordResetToken = tokenObject.passwordResetToken;
		user.passwordResetExpires = tokenObject.passwordResetExpires;
		
		await user.save({ validateBeforeSave: false });

		const message = `Reset password: ${process.env.FRONT_END_URL}/resetpassword/${tokenObject.resetToken}`

		try {
			// console.log(`Sending email to ${user.email} with content:\n${message}`);
			await sendEmail({
				email: user.email,
				subject: 'My AI Chat App - Reset Password',
				text: message
			});	

			res.status(200).json({ success: true, message: 'Email sent successfully' });
		} catch (emailError) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;

			await user.save({ validateBeforeSave: false });

			res.status(400).json({ success: false, message: 'Email was not sent' });
			
		}
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
}

exports.resetPassword = async (req, res) => {
	try {
		console.log(`starting resetpassword function\n`);
		const { password } = req.body;
		const resetToken = req.params.token;
		console.log(`reset token: ${resetToken}`);

		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
		console.log(`hashedToken: ${hashedToken}\n`);

		console.log("finding user");
		const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

		console.log(`hashed token:  + ${hashedToken}`);
		

		if (!user) {
			console.log("no user found");
			return res.status(400).json({ success: false, error: 'Invalid or expired token' });
		}
		console.log("user found");
		console.log(password);
		user.password = password;

		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		console.log("attempting to save");
		await user.save({ validateBeforeSave: false });
		console.log("updating: token");
		const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '30d'});
		console.log("sending response");
		res.status(200).json({
			success: true,
			token: jwtToken,
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		});
		
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
}	