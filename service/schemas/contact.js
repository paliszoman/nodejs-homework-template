const mongoose = require("mongoose");

const contact = mongoose.model(
  "contact",
  new mongoose.Schema({
    id: {
      type: String,
      minlength: 2,
      maxlength: 40,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 40,
    },
    email: {
      type: String,
      minlength: 2,
      maxlength: 40,
    },
    phone: {
      type: String,
      minlength: 9,
      maxlength: 12,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  })
);

module.exports = { contact };
