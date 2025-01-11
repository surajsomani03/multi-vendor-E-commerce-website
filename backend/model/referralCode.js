const mongoose = require("mongoose");

const referralCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
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
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userName: String,
    level: Number,
    referredAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Track earnings per level
  levelEarnings: {
    type: Map,
    of: Number,
    default: new Map()
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("ReferralCode", referralCodeSchema); 