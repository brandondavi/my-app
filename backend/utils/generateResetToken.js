const crypto = require('node:crypto');

const generateResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log(passwordResetToken);

    const passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return { resetToken, passwordResetToken, passwordResetExpires };
};

module.exports = generateResetToken;