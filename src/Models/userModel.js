import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: null,
    },

    // ✅ PROFILE FIELDS
    mobile: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: null,
    },

    location: {
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
    },

    // ✅ PROFILE IMAGE
    profilePic: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    otp: String,
    otpExpire: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    tokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
