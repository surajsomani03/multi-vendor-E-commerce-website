const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  gender: {
    type: String,
    required: [true, "Please specify your gender!"],
    enum: {
      values: ['male', 'female', 'other'],
      message: "Please select a valid gender option!"
    }
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter your phone number!"],
    unique: false,
    validate: {
      validator: async function(phone) {
        const phoneStr = phone.toString();
        if (phoneStr.length !== 10) {
          return false;
        }
        
        const count = await mongoose.models.User.countDocuments({ phoneNumber: phone });
        return count < 2;
      },
      message: props => 
        props.value.toString().length !== 10 
          ? "Phone number must be exactly 10 digits!"
          : "This phone number has already been used for maximum allowed accounts!"
    }
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(email) {
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }
        return true;
      },
      message: "Please enter a valid email address!"
    }
  },
  panCard: {
    type: String,
    required: [true, "Please enter your PAN card number!"],
    unique: true,
    validate: {
      validator: function(pan) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
      },
      message: "Please enter a valid PAN card number!"
    }
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    validate: {
      validator: function(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
      },
      message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character!"
    },
    select: false,
  },
  
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
  
  coupons: [
    {
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CouponCode",
      },
      receivedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});

// Hash password before saving and validate its format
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Additional password validation before hashing
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(this.password)) {
    throw new Error("Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character!");
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Convert PAN card to uppercase before saving
userSchema.pre("save", function(next) {
  if (this.panCard) {
    this.panCard = this.panCard.toUpperCase();
  }
  next();
});

// Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
