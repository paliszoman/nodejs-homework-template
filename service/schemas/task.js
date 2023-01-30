const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
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
});

const contact = mongoose.model("contact", contactSchema);

module.exports = contact;
