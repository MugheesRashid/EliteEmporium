const userModel = require("../models/users")
const productModel = require("../models/Products")
const { picUpload } = require("../config/multer")

async function addedProduct(req, res) {
    try {
      const user = await userModel.findOne({
        username: req.session.passport.user
      });
  
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }
      console.log(req.file)
  
      const filePaths = req.files.map(file => `/images/productImg/${file.filename}`);
      console.log(filePaths)
      await productModel.create({
        name: req.body.productName,
        productdescription: req.body.productDescription,
        price: req.body.productPrice,
        discountedPrice: req.body.discountPrice,
        stock: req.body.stock,
        category: req.body.category,
        description: req.body.description,
        sellerId: user._id,
        img: filePaths,
        colors: req.body.colors || [],
        sizes: req.body.sizes || []
      });
  
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  module.exports = addedProduct