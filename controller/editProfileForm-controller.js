const passport = require('passport')
const userModel = require('../models/users')
const flash = require('connect-flash')

async function editProfile(req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
  });
  const existingUsernameUser = await userModel.findOne({
    username: req.body.username,
    _id: { $ne: user._id }
  });
  if (existingUsernameUser) {
    req.flash(
      "error",
      "Oops! This username is already claimed. Try adding some pizzazz"
    );
    return res.redirect(`/profile/edit/${user._id}`);
  }
  const existingEmail = await userModel.findOne({
    email: req.body.email,
    _id: { $ne: user._id } 
  });
  if (existingEmail) {
    req.flash(
      "error",
      "This email is already in use. Try adding a little spice to it"
    );
    return res.redirect(`/profile/edit/${user._id}`);
  }
  if (user.email !== req.body.email) {
    user.isVerified = false;
}
  user.username= req.body.username
  user.number= req.body.number
  user.email= req.body.email
  user.address.location= req.body.location
  user.address.home= req.body.home
  user.address.province= req.body.province
  user.save()
    res.redirect('/dashboard')
}

module.exports = editProfile