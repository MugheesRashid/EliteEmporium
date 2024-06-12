const userModel = require('../models/users')

async function addProduct(req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    res.render("addProduct",{
      loggedin: true,
      side: false, 
      user: user,
      success: req.flash("success"),
      info: req.flash("info")
    })
  }
  module.exports = addProduct