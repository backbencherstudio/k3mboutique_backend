const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlayersSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    parent_email: {
      type: String,
    },
    username : {
      type: String,
      required: [true, "username is required and unique"],
      unique: true,
    },
    parent_phone : { type: String},
    position: {type: String},
    jersey_number : {type: Number},
    parent_name: {type: String},
    birth_date: {type: Date},
    rating: { type: Number, default: 0 },
    reliability: { type: Number, default: 0 },
   
    avatar: { type: String, default: null },

   
    country: { type: String },
    blacklist: { type: Boolean, default: false },
    active: { type: Boolean, default: false },


    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Players", PlayersSchema);
