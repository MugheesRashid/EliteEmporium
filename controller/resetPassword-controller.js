const userModel = require('../models/users')

const resetPassword = async (req, res) => {
    try {
      const user = await userModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        console.log('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot-password');
      }
  
      if (req.body.password === req.body.confirmPassword) {
        user.setPassword(req.body.password, async (err) => {
          if (err) {
            console.log('error', 'Error resetting password.');
            return res.redirect(`/reset/${req.params.token}`);
          }
          
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.isVerified = true;
          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save();
  
          console.log('success', 'Your password has been successfully reset.');
          res.redirect('/login');
        });
      } else {
        console.log('error', 'Passwords do not match.');
        return res.redirect(`/reset/${req.params.token}`);
      }
    } catch (error) {
      console.error(error);
      console.log( 'An error occurred while resetting the password.');
      res.redirect('/forgot-password');
    }
  };
  
  module.exports = resetPassword;
  