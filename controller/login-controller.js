const userModel = require('../models/users')

const login_Controller = (req,res)=>{
    const errorMessage = req.flash("error");
    res.render("login", { error: errorMessage });
}

module.exports = login_Controller