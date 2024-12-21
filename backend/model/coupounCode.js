const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        //required: [true, "Please enter your coupon code name!"],
        unique: true,
    },
    // value: {
    //     type: Number,
    //     required: true,
    // },
    // shopId: {
    //     type: String,
    //     required: true,
    // },
    // selectedProduct: {
    //     type: String,
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who receives the coupon
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("CouponCode", couponCodeSchema);
