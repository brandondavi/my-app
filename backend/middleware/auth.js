
const jwt = require('jsonwebtoken'); // to create a token that contains user id
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // to split the Bearer a1b2c3..., and keep the second part
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to acces this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token failed verification' });
    }
};