const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street1: {
      type: String,
      default: '',
      maxlength: 255,
    },
    street2: {
      type: String,
      default: '',
      maxlength: 255,
    },
    city: {
      type: String,
      default: '',
      maxlength: 100,
    },
    state: {
      type: String,
      default: '',
      maxlength: 100,
    },
    zipcode: {
      type: String,
      default: '',
      maxlength: 20,
    },
    country: {
      type: String,
      default: '',
      maxlength: 100,
    },
  });

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: addressSchema,
        default: {}
      },
    phone: {
        type: String,
        maxlength: 45,
        unique: true,
        default: '',
        },
    gender: {
        type: String,
        required: false,
        enum: ["Male", "Female", "Other"]
    },
    profilephoto: {
        type: String,
        default: "",
        required: false,
    },
    role: {
        type: String,
        default: "User",
        required: false,
    },
    otp: {
        type: String,
        default: "000000",
        required: false,
    },
    status: {
        type: String,
        default: "Active",
        required: false,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;