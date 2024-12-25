const ErrorHandler = require("./ErrorHandler");
const CoupounCode = require("../model/coupounCode");
const User = require("../model/user");  // Make sure you import the User model

// Generate coupon code 
const generateCouponName = (suffix = "") => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random alphanumeric string
    const timestamp = Date.now().toString(36).toUpperCase(); // Generate a timestamp in base-36 for uniqueness
    return `COUPON-${randomString}-${timestamp}${suffix}`; // Example: COUPON-XKDLAI-JD98LA
  };
  
  // Assign coupon code based on the total order price
  const assignCouponToUser = async (totalPrice, userId) => {
    let couponCount = 0;
    
    // Determine the number of coupons based on the total price
    if (totalPrice >= 2950 && totalPrice < 5900) {
      couponCount = 1; // 1 coupon
    } else if (totalPrice >= 5900 && totalPrice < 8850) {
      couponCount = 3; // 3 coupons
    } else if (totalPrice >= 8850 && totalPrice < 11800) {
      couponCount = 5; // 5 coupons
    } else if (totalPrice >= 11800) {
      couponCount = 7; // 7 coupons
    }
  
    console.log(`Coupon count to assign: ${couponCount}`);
    console.log(`User ID: ${userId}`);
  
    // Generate multiple unique coupon names and assign them to the user
    if (couponCount > 0) {
      try {
        for (let i = 0; i < couponCount; i++) {
          // Generate a unique coupon name for each coupon
          const couponName = generateCouponName();
  
          // Create a new coupon entry with the generated name
          const newCoupon = await CoupounCode.create({
            name: couponName,
            userId: userId,
          });
  
          console.log(`Created coupon: ${newCoupon.name}`);
  
          // Append the new coupon to the user's coupons array
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { coupons: { couponId: newCoupon._id } } }, // Push to the coupons array
            { new: true }
          );
          
          if (updatedUser) {
            console.log(`Updated user with new coupon: ${updatedUser.name}`);
          } else {
            console.error(`User with ID ${userId} not found.`);
          }
        }
      } catch (error) {
        console.error("Error assigning coupons:", error); // Log the full error
        throw new ErrorHandler(error.message, 500);
      }
    }
  };
  
  // Export the assignCouponToUser function
  module.exports = {
    assignCouponToUser,
  };