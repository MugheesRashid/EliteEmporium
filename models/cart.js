const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

const cartSchema = new mongoose.Schema({
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  Qty: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});
cartSchema.plugin(plm);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
