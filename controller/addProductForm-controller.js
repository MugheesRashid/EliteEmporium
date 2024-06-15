const userModel = require("../models/users")
const productModel = require("../models/Products")

async function addedProduct(req, res) {
    try {
        console.log("Fetching user...");
        const user = await userModel.findOne({ username: req.session.passport.user });

        if (!user) {
            console.error("User not found");
            return res.status(400).send('User not found');
        }
        if (!req.files) {
            console.error("No files were uploaded");
            return res.status(400).send('No files were uploaded.');
        }
        const filePaths = req.files.map(file => `/images/productImg/${file.filename}`);

        console.log("Creating product...");
       const newProduct = await productModel.create({
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
        if (!user.myStore) {
            user.myStore = { myProducts: [] };
        }

        user.myStore.myProducts.push(newProduct._id);
        await user.save();
        
        res.redirect("/shop");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send(error.message);
    }
}

  module.exports = addedProduct