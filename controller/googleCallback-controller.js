const passport = require('passport')

const googleCallback =  (req, res, next) => {
    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Check the info object for the message
          if (info && info.message === "usernameConflict") {
            req.flash(
              "info",
              "The username provided by your google account already exists. Our system has made some amendments in your username."
            );
          }
          res.redirect("/");
        });
      }
    )(req, res, next);
}

  module.exports = googleCallback