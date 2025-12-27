import IncomeModel, { ExpenseModel, SplitModel } from '../Models/transaction.js';
import { isValidEmail } from '../utils/validateEmail.js';
import User from '../Models/userModel.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../envconfig.js';
import mongoose from 'mongoose';



export const AddIncome = async (req, res, next) => {
  try {
    const transaction = new IncomeModel(req.body);
    await transaction.save();
    return res.status(201).json({
      success: true,
      message: 'Income added successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};


export const dashboard = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const incomeResult = await IncomeModel.aggregate([
      { $match: { userId: objectUserId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = incomeResult[0]?.total || 0;

    const expenseResult = await ExpenseModel.aggregate([
      { $match: { userId: objectUserId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalExpense = expenseResult[0]?.total || 0;

    const splitResult = await SplitModel.aggregate([
      { $match: { userId: objectUserId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalSplit = splitResult[0]?.total || 0;
    const total = totalIncome - totalExpense - totalSplit;
    return res.status(200).json({
      success: true,
      data: {
        total,
        totalIncome,
        totalExpense,
        totalSplit
      }
    });
  } catch (error) {
    next(error)
  }
}


export const AddExpense = async (req, res, next) => {
  try {
    const expense = new ExpenseModel(req.body);
    await expense.save();
    return res.status(201).json({
      success: true,
      message: 'expense added successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getSplit = async (req, res, next) => {

  try {
    const splitData = await SplitModel.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: splitData })
  } catch (error) {
    next(error)
  }
}

export const AddSplit = async (req, res, next) => {
  try {
    const split = new SplitModel(req.body);
    await split.save();
    return res.status(201).json({
      success: true,
      message: 'split added successfully',
      data: split,
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    // ❌ Invalid email format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

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
    const { email, otp } = req.body || {};

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpire = null;
    user.isVerified = true;

    // ✅ CREATE TOKEN
    const token = jwt.sign({ id: user._id, role: user?.role }, JWT_SECRET_KEY, {
      expiresIn: '7d',
    });

    // ✅ SAVE TOKEN IN DB
    user.tokens.push({ token });
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'OTP verified & login successful',
      token, // 🔥 MUST BE HERE
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      needsName: !user.name,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserName = async (req, res, next) => {
  try {
    const { name } = req.body || {};

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: 'Name is required' });
    }

    // ✅ USER ID FROM TOKEN
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.name = name;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile completed',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    console.log('🔥 GET /api/user hit');
    const users = await User.find().select('-otp -otpExpire');
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ REMOVE CURRENT TOKEN
    user.tokens = user.tokens.filter((t) => t.token !== req.token);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
