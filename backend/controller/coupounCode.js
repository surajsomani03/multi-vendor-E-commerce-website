const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const User = require("../model/user");  // Make sure you import the User model
const router = express.Router();

// Route to get coupon codes by userId
router.get(
  "/get-coupons/:userId", 
  catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;

    try {
      // Fetch coupon codes for the specified user
      const coupons = await CoupounCode.find({ userId });

      if (!coupons || coupons.length === 0) {
        return next(new ErrorHandler("No coupons found for this user", 404));
      }

      // Extract coupon names
      const couponNames = coupons.map(coupon => coupon.name);

      res.status(200).json({
        success: true,
        couponNames,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;




// The code has to be implemented for the seller side If seller want to create their own coupon code 
// create coupoun code
// router.post(
//   "/create-coupon-code",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const isCoupounCodeExists = await CoupounCode.find({
//         name: req.body.name,
//       });

//       if (isCoupounCodeExists.length !== 0) {
//         return next(new ErrorHandler("Coupoun code already exists!", 400));
//       }

//       const coupounCode = await CoupounCode.create(req.body);

//       res.status(201).json({
//         success: true,
//         coupounCode,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // get all coupons of a shop
// router.get(
//   "/get-coupon/:id",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
//       res.status(201).json({
//         success: true,
//         couponCodes,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // delete coupoun code of a shop
// router.delete(
//   "/delete-coupon/:id",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

//       if (!couponCode) {
//         return next(new ErrorHandler("Coupon code dosen't exists!", 400));
//       }
//       res.status(201).json({
//         success: true,
//         message: "Coupon code deleted successfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // get coupon code value by its name
// router.get(
//   "/get-coupon-value/:name",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const couponCode = await CoupounCode.findOne({ name: req.params.name });

//       res.status(200).json({
//         success: true,
//         couponCode,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

module.exports = router;
