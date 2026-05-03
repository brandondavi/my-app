const { response } = require('express');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user:process.env.EMAIL_USER,
			pass:process.env.EMAIL_PASS,
		},
	});
	
	const mailOptions = {
		from: `Chat Auth <${process.env.EMAIL_USER}>`,
		to: options.email,
		subject: options.subject,
		text: options.text
	};

	const response = await transporter.sendMail(mailOptions);
	return response;
}

module.exports = sendEmail; 