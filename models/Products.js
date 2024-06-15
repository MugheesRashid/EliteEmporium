const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

const productSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
  },
  name: {
    type: String,
  },
  img: [{
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
  }],
  description: {
    type: String,
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
   type: Number,
  },
  adminRated: {
     type: String,
  },
  category: {
    type: String,
  },
  colors: {
    type: [String],
    default: []
},
sizes: {
    type: [String],
    default: []
},
  reviews: [{
    user: {
        type: String,
    },
    stars: {
      type: String,
  },
   review: {
    type: String,
}
}],
  sellerId: 
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } ,
});
productSchema.plugin(plm);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
