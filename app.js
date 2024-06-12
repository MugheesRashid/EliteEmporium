var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');

var userModel = require('./models/users');
var indexRouter = require('./routes/index');

var app = express();
require('dotenv').config()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'secret'
}));

app.use(passport.initialize());
app.use(passport.session());

const defaultDpUrl = 'https://tse2.mm.bing.net/th?id=OIP.P0KBr2gfjXWqf03OSvv-FQHaGz&pid=Api&P=0&h=220';  // Replace with your actual default DP URL
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await userModel.findOne({ email: profile.emails[0].value });

    let usernameConflict = false;
    let username = profile.displayName;

    if (user) {
      const existingUserWithUsername = await userModel.findOne({ username: profile.displayName, _id: { $ne: user._id } });

      if (existingUserWithUsername) {
        const randomNo = Math.floor(100 + Math.random() * 900);
        username = `${profile.displayName}-${randomNo}`;
        usernameConflict = true;
      }

      user.username = username;

      if (user.dp === defaultDpUrl) {
        user.dp = profile.photos[0].value;
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
    } else {
      const existingUserWithUsername = await userModel.findOne({ username: profile.displayName });
      if (existingUserWithUsername) {
        const randomNo = Math.floor(100 + Math.random() * 900);
        username = `${profile.displayName}-${randomNo}`;
        usernameConflict = true;
      }
      user = new userModel({
        username: username,
        email: profile.emails[0].value,
        dp: profile.photos[0].value,
        isVerified: true
      });
    }
    await user.save();
    done(null, user, { message: usernameConflict ? 'usernameConflict' : undefined });
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
