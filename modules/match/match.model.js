const mongoose = require("mongoose");
const { Schema } = mongoose;

// Custom Validator to check player count
const playerCountValidator = (players) => {
  return players.length <= 15;
};

const MatchSchema = new Schema(
  {
    teamA: {
      name: { type: String, required: true },
      players: {
        type: [ { type: Schema.Types.ObjectId, ref: "Players", required: true } ],
        validate: {
          validator: playerCountValidator,
          message: "Team A cannot have more than 15 players.",
        },
      },
    },
    teamB: {
      name: { type: String, required: true },
   
    },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    stadium: { type: String, required: true },
    manager: { type: String, required: true },
    matchStatus: {
      type: String,
      enum: ["Published", "Scheduled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);
