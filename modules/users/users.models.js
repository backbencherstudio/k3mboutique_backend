const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "email is required and unique"],
      unique: true,
    },
    first_name: { type: String },
    last_name: { type: String },
    birth_date: { type: Date },
    phone: { type: String },
    childlist: { type: [String], default: [] },
    address: { type: String, default: null },
    Apparment: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },
    bio: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    role: {
      type: String,
      enum: ["admin", "parent", "worker"],
      default: "admin",
    },
    rating: { type: Number, default: 0 },
    reliability: { type: Number, default: 0 },
    total_job: { type: Number, default: 0 },
    topbadge: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    lawnphoto: { type: String },
    newpassword: { type: String },
    confirmPassword: { type: String },
    country: { type: String },
    blacklist: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
