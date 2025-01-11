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

// Verify referral code and get referrer details
const verifyReferralCode = async (code) => {
  const referral = await ReferralCode.findOne({ code });
  if (!referral) return null;

  return {
    referrerId: referral.userId,
    referrerName: referral.userName,
    referralCode: referral.code,
  };
};

// Update referral usage and create tree structure
updateReferralUsage = async (code, newUserId, newUserName) => {
  try {
    // Find the immediate referrer's code
    const immediateReferral = await ReferralCode.findOne({ code });
    if (!immediateReferral) throw new Error("Invalid referral code");

    // Get the new user's details
    const newUser = await User.findById(newUserId);
    if (!newUser) throw new Error("User not found");

    // Add level 1 referral
    await addReferralAtLevel(immediateReferral, newUserId, newUserName, 1);

    // Find and update upper level referrals (up to 13 levels)
    let currentUserId = immediateReferral.userId;
    let currentLevel = 2;

    while (currentLevel <= 13) {
      // Find the user who referred the current user
      const user = await User.findById(currentUserId);
      if (!user || !user.referredBy) break;

      // Find their referral code document
      const upperReferral = await ReferralCode.findOne({
        userId: user.referredBy,
      });
      if (!upperReferral) break;

      // Add the new user to this level
      await addReferralAtLevel(
        upperReferral,
        newUserId,
        newUserName,
        currentLevel
      );

      // Move up the tree
      currentUserId = user.referredBy;
      currentLevel++;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get referral tree for a user
getReferralTree = async (userId) => {
  try {
    const referralCode = await ReferralCode.findOne({ userId });
    if (!referralCode) return null;

    // Get direct referrals (level 1)
    const directReferrals = referralCode.usedBy.filter(
      (ref) => ref.level === 1
    );

    // Build complete tree structure
    const tree = {
      userId: referralCode.userId,
      userName: referralCode.userName,
      code: referralCode.code,
      totalEarnings: referralCode.totalEarnings,
      levels: {},
    };

    // Organize referrals by level
    for (let level = 1; level <= 13; level++) {
      const levelReferrals = referralCode.usedBy.filter(
        (ref) => ref.level === level
      );
      if (levelReferrals.length > 0) {
        tree.levels[level] = levelReferrals.map((ref) => ({
          userId: ref.userId,
          userName: ref.userName,
          referredAt: ref.referredAt,
        }));
      }
    }

    return tree;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Calculate earnings based on level
calculateLevelEarnings = async (userId, purchaseAmount) => {
  try {
    // Define commission percentages for each level
    const levelCommissions = {
      1: 0.08, // 8% for level 1
      2: 0.03, // 3% for level 2
      3: 0.02, // 2% for level 3
      4: 0.01, // 1% for level 4
      5: 0.01, // 1% for level 5
      6: 0.005, // 0.50% for level 6
      7: 0.005, //  0.50% for level 7
      8: 0.005, //  0.50% for level 8
      9: 0.005, //  0.50% for level 9
      10: 0.0025, // 0.25% for level 10
      11: 0.0025, // 0.25% for level 11
      12: 0.0025, // 0.25% for level 12
      13: 0.0025, // 0.25% for level 13
      // Add more levels as needed (up to 13)
    };

    let currentUserId = userId;
    let currentLevel = 1;

    while (currentLevel <= 13 && currentUserId) {
      const user = await User.findById(currentUserId);
      if (!user || !user.referredBy) break;

      const referralCode = await ReferralCode.findOne({
        userId: user.referredBy,
      });
      if (!referralCode) break;

      // Calculate commission for this level
      const commission = purchaseAmount * levelCommissions[currentLevel];

      // Update earnings for this level
      const currentLevelEarnings =
        referralCode.levelEarnings.get(currentLevel.toString()) || 0;
      referralCode.levelEarnings.set(
        currentLevel.toString(),
        currentLevelEarnings + commission
      );
      referralCode.totalEarnings += commission;

      await referralCode.save();

      // Move up the tree
      currentUserId = user.referredBy;
      currentLevel++;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

async function addReferralAtLevel(referralCode, userId, userName, level) {
  // Check if user is already referred at this level
  const existingReferral = referralCode.usedBy.find(
    (ref) => ref.userId.toString() === userId.toString() && ref.level === level
  );

  if (!existingReferral) {
    referralCode.usedBy.push({
      userId,
      userName,
      level,
      referredAt: new Date(),
    });
    await referralCode.save();
  }
}

module.exports = {
  generateReferralCode,
  verifyReferralCode,
  updateReferralUsage,
  getReferralTree,
  calculateLevelEarnings,
  addReferralAtLevel,
};
