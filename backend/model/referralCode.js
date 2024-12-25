const mongoose = require("mongoose");

const referralCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Updated usedBy array to include user name
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userName: {
      type: String,
      required: true
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model("ReferralCode", referralCodeSchema); 