const ReferralCode = require("../model/referralCode");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const referralController = {
  // Verify referral code and get referrer details
  verifyReferralCode: async (referralCode) => {
    if (!referralCode) return null;

    const referral = await ReferralCode.findOne({ code: referralCode });
    if (!referral) return null;

    const referrer = await User.findById(referral.userId);
    if (!referrer) return null;

    return {
      referrerId: referrer._id,
      referrerName: referrer.name,
      referralCode: referral.code
    };
  },

  // Update referral usage with user name
  updateReferralUsage: async (referralCode, newUserId) => {
    try {
      const referral = await ReferralCode.findOne({ code: referralCode });
      if (!referral) return;

      // Fetch user details to get the name
      const user = await User.findById(newUserId);
      if (!user) {
        throw new Error("User not found");
      }

      referral.usageCount += 1;
      referral.usedBy.push({
        userId: newUserId,
        userName: user.name, // Use the user's name from the fetched user
        usedAt: new Date()
      });

      await referral.save();
    } catch (error) {
      console.error("Error updating referral usage:", error);
      throw error;
    }
  },

  // Get referral statistics
  getReferralStats: catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;

    const referralCode = await ReferralCode.findOne({ userId });

    if (!referralCode) {
      return next(new ErrorHandler("No referral code found for this user", 404));
    }

    res.status(200).json({
      success: true,
      referralCode: referralCode.code,
      usageCount: referralCode.usageCount,
      usedBy: referralCode.usedBy
    });
  }),
};

module.exports = referralController; 