const userModel = require("../models/users");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const otpEmail = require("../utils/otpEmail");

const signupForm = async (req, res) => {
  try {
    const existingEmailUser = await userModel.findOne({
      email: req.body.email,
    });
    if (existingEmailUser) {
      req.flash(
        "error",
        "This email is already in use. Try adding a little spice to it"
      );
      return res.redirect("/signup");
    }

    const existingUsernameUser = await userModel.findOne({
      username: req.body.username,
    });
    if (existingUsernameUser) {
      req.flash(
        "error",
        "Oops! This username is already claimed. Try adding some pizzazz"
      );
      return res.redirect("/signup");
    }

    if (req.body.password === req.body.confirmpassword) {
      const { otp, otpExpires } = otpEmail(req.body.email, req.body.username);

      const userdata = new userModel({
        username: req.body.username,
        email: req.body.email,
        number: req.body.number,
        otp: otp,
        otpExpires: otpExpires,
        isVerified: false,
      });

      await userModel.register(userdata, req.body.password);
      passport.authenticate("local")(req, res, () => {
        req.flash("info", "You are registered successfully. Please verify your email.");
        res.redirect("/otp");
      });
    } else {
      req.flash(
        "error",
        "Mismatch alert! Your passwords couldn't agree more to disagree."
      );
      res.redirect("/signup");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred during registration");
    res.redirect("/signup");
  }
};

module.exports = signupForm;
