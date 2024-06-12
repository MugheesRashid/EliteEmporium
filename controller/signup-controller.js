const userModel = require('../models/users')

const signup_Controller = (req,res)=>{
    res.render("signup", {
        error: req.flash("error"),
      });
}

module.exports = signup_Controller