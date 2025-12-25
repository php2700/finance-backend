import TransactionModel from '../Models/transaction.js';

import User from '../Models/userModel.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpMail } from '../utils/sendMail.js';

export const AddTransction = async (req, res, next) => {
  try {
    const transaction = new TransactionModel(req.body);
    await transaction.save();
    return res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    const otp = generateOtp();

    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to email',
      isNewUser: !user.name,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpire = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      needsName: !user.name,
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserName = async (req, res, next) => {
  try {
    const { userId, name } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile completed',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-otp -otpExpire');
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};
