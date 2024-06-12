const userModel = require('../models/users')

async function dpPic(req, res) {
    try {
      const user = await userModel.findOne({
        username: req.session.passport.user
      })
      const file = req.file.filename
      user.dp = file
     await user.save()
      res.redirect(`/profile/edit/${user._id}`)
    } catch (err) {
      console.log(err)
      res.status(500).send('Error uploading file');
    }
    }
    module.exports = dpPic