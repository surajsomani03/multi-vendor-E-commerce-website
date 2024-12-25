const ReferralCode = require("../model/referralCode");
const User = require("../model/user");
const ErrorHandler = require("./ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// Function to generate unique referral code
const generateReferralCode = async (userName) => {
    // Take first 3 characters of username (converted to uppercase)
    const prefix = userName.slice(0, 3).toUpperCase();
    // Generate random 4 digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    const code = `${prefix}${random}`;
    
    // Check if code already exists
    const existingCode = await ReferralCode.findOne({ code });
    if (existingCode) {
      // If exists, try again
      return generateReferralCode(userName);
    }
    return code;
  };

  module.exports = {
    generateReferralCode
  }