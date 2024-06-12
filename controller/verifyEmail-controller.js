const userModel = require("../models/users");
const otpEmail = require("../utils/otpEmail");

async function emailVerify(req, res) {
  try {
    if (!req.session.passport || !req.session.passport.user) {
        req.flash("error", "User session not found");
        return res.redirect("/login"); // Adjust the redirect as needed
      }
      const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const { otp, otpExpires } = otpEmail(user.email, user.username);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    req.flash("success", "OTP has been sent to your email");
    res.redirect("/otp"); 
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while verifying email");
    res.redirect("/"); // Adjust the redirect as needed
  }
}

module.exports = emailVerify;
