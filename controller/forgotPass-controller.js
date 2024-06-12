
const forgotPass=(req, res)=>{
    res.render('forgotPass', {
        error: req.flash("error"),
        info: req.flash("info"),
      })
}

module.exports = forgotPass