var express = require("express");
var router = express.Router();
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");
const productModel = require("../models/Products")
const cartModel = require("../models/cart")
const multer = require('multer')
const {dpUpload, picUpload} = require('../config/multer')

// Passport Configuration
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Controllers
var home_Controller = require("../controller/home_controller")
var main_Shop = require("../controller/mainShop-controller");
var login_Controller = require("../controller/login-controller");
var signup_Controller = require("../controller/signup-controller");
var signupForm_Controller = require("../controller/signupForm-controller");
var validationForm_Controller = require("../controller/validationForm-Controller");
var forgotPass_Controller = require("../controller/forgotPass-controller");
var forgotPassForm_Controller = require("../controller/forgotPassForm-controller");
var resetPassword_Controller = require("../controller/resetPassword-controller");
var editProfile_Controller = require("../controller/editProfile-controller");
var editProfileForm_Controller = require("../controller/editProfileForm-controller");
var verifyEmail_controller = require("../controller/verifyEmail-controller");
const otp_Controller = require('../controller/otp-controller')
const googleCallback_Controller = require("../controller/googleCallback-controller");
const dp_Controller = require("../controller/dp-controller")
const addProduct_Controller = require('../controller/addProduct')
const addProductForm_Controller = require('../controller/addProductForm-controller');


// Autentication

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
async function isVerified(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  if (user.isVerified) {
    return next();
  }
  res.redirect("/verify");
}
router.get("/", home_Controller);
router.get("/shop", main_Shop);
router.get("/login", login_Controller);
router.get("/signup", signup_Controller);
router.post("/register", signupForm_Controller);
// Login Route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
//Forgot and Reset pass Route
router.get("/forgot-password", forgotPass_Controller);
router.post("/forgot-password", forgotPassForm_Controller);
router.get("/reset/:token", (req, res) => {
  res.render("resetPass", {
    token: req.params.token,
    error: req.flash("error"),
  });
});
router.post("/reset/:token", resetPassword_Controller);
// OTP Routes
router.get("/otp",isLoggedIn, otp_Controller);
router.post("/otp", validationForm_Controller);
// Logout Route
router.get("/logout",isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
// Google auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/auth/google/callback", googleCallback_Controller );
// Google auth End
//EmailVerification Manual
router.get("/verify",isLoggedIn, verifyEmail_controller);
//EmailVerification ManualEnd
// Autentication End


//Dashboard Config
router.get("/dashboard", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("dashboard", { loggedin: true, side: false, user: user });
});
router.get("/profile/edit/:id", isLoggedIn, editProfile_Controller);
router.post("/edited/:id", isLoggedIn, editProfileForm_Controller);
router.post( "/dp",isLoggedIn, dpUpload.single("dpimg"), dp_Controller);
//Dashboard ConfigEnd


//Product Config
router.get("/addProduct",isLoggedIn ,isVerified, addProduct_Controller)
router.post("/productadded", picUpload.array('productImages', 5), addProductForm_Controller)
//Product COnfig end


//ProductPreview
router.get("/preview/:id", isLoggedIn, async function (req, res) {
  try {
    const product = await productModel.findOne({
      _id: req.params.id
    })
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    res.render("previewProduct", {product: product,user: user, side:false })
  } catch (err) {
    res.send(err)
  }
})
//ProductPreviewEnd
//Cart Section
router.post("/addToCart/:id", isLoggedIn, async function (req, res) {
  try {
    const { productId, selectedColor, selectedSize, quantity } = req.body

    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    const product = await productModel.findOne({
      _id: productId
    })
     const newCartItem = await cartModel.create({
      holder: user._id,
      product: product._id,
      Qty: quantity,
      totalPrice: quantity * product.discountedPrice,
      color: selectedColor,
      size: selectedSize
    })
    user.myCart.push(newCartItem)
    await user.save()
    res.redirect(`/preview/${productId}`)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})
//Cart SectionEnd

module.exports = router;
