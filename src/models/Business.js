const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function () {
        return (
          !this.image.startsWith("http://") ||
          !this.image.startsWith("https://")
        );
      },
      message: "You should fill in a valid link in the Crypto Image field.",
    },
  },
  price: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, minlength: 10 },
  payment: {
    type: String,
    enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
  },
  buyers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
  initialCoin: { type: String },
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
