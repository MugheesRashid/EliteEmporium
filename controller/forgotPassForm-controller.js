const crypto = require('crypto');
const userModel = require('../models/users')
const nodemailer = require('nodemailer')

const forgotPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'No account with that email found.');
      return res.redirect('/forgot-password');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "512mughees@gmail.com",
        pass: "ehgr bnkw hbuh ixkl",
      },
    });

    const mailOptions = {
      to: user.email,
      from: '512mughees@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect('/forgot-password');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while sending the reset email.');
    res.redirect('/forgot-password');
  }
};

module.exports = forgotPassword;