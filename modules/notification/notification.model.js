const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["match_created", "match_updated", "vote_added", "general"], 
    default: "general" 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  matchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Match" 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId 
  } // For other types of notifications
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Notification", NotificationSchema);