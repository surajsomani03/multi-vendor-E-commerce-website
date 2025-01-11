const ReferralCode = require("../model/referralCode");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { getReferralTree } = require("../utils/ReferralCodeGenerate");

// Get referral tree for a user
router.get(
  "/get-referral-tree/:userId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const tree = await getReferralTree(req.params.userId);
      res.status(200).json({
        success: true,
        tree
      });
    } catch (error) {
      next(error);
    }
  })
);

// Get earnings by level
router.get(
  "/get-level-earnings/:userId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const referralCode = await ReferralCode.findOne({ userId: req.params.userId });
      if (!referralCode) {
        return next(new ErrorHandler("Referral code not found", 404));
      }

      res.status(200).json({
        success: true,
        levelEarnings: Object.fromEntries(referralCode.levelEarnings),
        totalEarnings: referralCode.totalEarnings
      });
    } catch (error) {
      next(error);
    }
  })
);

module.exports = router; 