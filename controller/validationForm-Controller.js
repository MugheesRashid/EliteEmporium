const userModel = require("../models/users");
const passport = require("passport");

const verifyOTP = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
      otp: req.body.otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash("error", "Invalid OTP or OTP has expired.");
      return res.redirect("/otp");
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Your email has been verified successfully.");
      return res.redirect("/");
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred during OTP verification.");
    res.redirect("/otp", {error: req.flash("error")},)
  }
};

module.exports = verifyOTP;
