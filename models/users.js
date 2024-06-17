const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  dp: {
    type: Schema.Types.Mixed,
    default : "https://tse2.mm.bing.net/th?id=OIP.P0KBr2gfjXWqf03OSvv-FQHaGz&pid=Api&P=0&h=220",
  },
  password: {
    type: String,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
   province: {type: String},
   location: {type: String},
   home: {type: String}
  },
  category: {
    type: String,
  },
  myCart: [{
    type: Array,
  }],
  myStore: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  myOrders: [],
  otp: Number,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
userSchema.plugin(plm);

const User = mongoose.model("User", userSchema);

module.exports = User;
