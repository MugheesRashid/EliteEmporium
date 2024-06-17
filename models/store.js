const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

const storeSchema = new mongoose.Schema({
    storeName: { type: String },
    storeDp: { type: String },
    myProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    discription: { type: String},
    banner: { type: String},
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
storeSchema.plugin(plm);

const Shop = mongoose.model("Shop", storeSchema);

module.exports = Shop;
