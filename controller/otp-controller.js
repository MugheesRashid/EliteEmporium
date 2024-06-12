const userModel = require('../models/users')

async function Otp(req, res) {
    if (!req.isAuthenticated()) {
      req.flash("error", "You need to log in first.");
      return res.redirect("/login");
    }
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) {
      req.flash("error", "No user found.");
      return res.redirect("/login");
    }
    res.render("emailValidator", {
      user,
      error: req.flash("error"),
      info: req.flash("info"),
    });
  }

module.exports = Otp