const passport = require('passport')
const userModel = require('../models/users')

async function editProfile(req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
  });
    res.render("editProfile", { loggedin: true , side: false, user: user , error: req.flash('error')})
}

module.exports = editProfile