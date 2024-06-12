const userModel = require("../models/users");
const productModel = require("../models/Products");

const home_Controller = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = await userModel.findOne({
        username: req.session.passport.user,
      });
      const products = await productModel.find();
      res.render("home", {
        loggedin: true,
        user: user,
        side: true,
        success: req.flash("success"),
        info: req.flash("info"),
        products: products,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    const products = await productModel.find();
    res.render("home", {
      loggedin: false,
      side: true,
      success: req.flash("success"),
      user: false,
      info: false,
      products: products,
    });
  }
};

module.exports = home_Controller;
