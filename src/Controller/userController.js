import IncomeModel, {
  ExpenseModel,
  SplitModel,
} from '../Models/transaction.js';
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

export const transaction = async (req, res, next) => {
  try {
    const { transactionType } = req.query;
    const { userId } = req.params;

    const objectUserId = new mongoose.Types.ObjectId(userId);

    if (transactionType === 'income') {
      const incomeTransaction = await IncomeModel.find({
        userId: objectUserId,
      })
        .populate('incomeCategoryId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: incomeTransaction,
      });
    }

    if (transactionType === 'expense') {
      const expenseTransaction = await ExpenseModel.find({
        userId: objectUserId,
      })
        .populate('expenseCategoryId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: expenseTransaction,
      });
    }

    const [income, expense] = await Promise.all([
      IncomeModel.find({ userId: objectUserId })
        .populate({
          path: 'incomeCategoryId',
          select: 'name image',
        })
        .lean(),

      ExpenseModel.find({ userId: objectUserId })
        .populate({
          path: 'expenseCategoryId',
          select: 'name image',
        })
        .lean(),
    ]);

    const incomeWithType = income.map((item) => ({
      ...item,
      transactionType: 'income',
    }));

    const expenseWithType = expense.map((item) => ({
      ...item,
      transactionType: 'expense',
    }));

    const allTransactions = [...incomeWithType, ...expenseWithType].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const monthTransaction = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 🔹 Current month boundaries
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // 🔹 Fetch both sorted by insertion time
    const [income, expense] = await Promise.all([
      IncomeModel.find({
        userId: objectUserId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate('incomeCategoryId', 'name image')
        .sort({ createdAt: 1 }) // ⬅ oldest → newest
        .lean(),

      ExpenseModel.find({
        userId: objectUserId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate('expenseCategoryId', 'name image')
        .sort({ createdAt: 1 }) // ⬅ oldest → newest
        .lean(),
    ]);

    // 🔹 Add transaction type
    const incomeWithType = income.map((item) => ({
      ...item,
      transactionType: 'income',
    }));

    const expenseWithType = expense.map((item) => ({
      ...item,
      transactionType: 'expense',
    }));

    // 🔹 Merge WITHOUT sorting again
    const allTransactions = [...incomeWithType, ...expenseWithType].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return res.status(200).json({
      success: true,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalTransactions: allTransactions.length,
      data: allTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const dashboard = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [incomeAgg, expenseAgg, splitAgg] = await Promise.all([
      IncomeModel.aggregate([
        { $match: { userId: objectUserId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      ExpenseModel.aggregate([
        { $match: { userId: objectUserId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      SplitModel.aggregate([
        { $match: { userId: objectUserId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;
    const totalSplit = splitAgg[0]?.total || 0;

    const total = totalIncome - totalExpense - totalSplit;

    const percentage =
      totalIncome > 0 ? Number(((total / totalIncome) * 100).toFixed(2)) : 0;

    const percentStatus = percentage >= 0 ? 'positive' : 'negative';

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const currentMonthMatch = {
      userId: objectUserId,
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    };

    const [incomeMonth, expenseMonth, splitMonth] = await Promise.all([
      IncomeModel.aggregate([
        { $match: currentMonthMatch },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      ExpenseModel.aggregate([
        { $match: currentMonthMatch },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      SplitModel.aggregate([
        { $match: currentMonthMatch },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const currentMonthIncome = incomeMonth[0]?.total || 0;
    const currentMonthExpense = expenseMonth[0]?.total || 0;
    const currentMonthSplit = splitMonth[0]?.total || 0;

    const currentMonthTotal =
      currentMonthIncome - currentMonthExpense - currentMonthSplit;

    const currentMonthPercentage =
      currentMonthIncome > 0
        ? Number(((currentMonthTotal / currentMonthIncome) * 100).toFixed(2))
        : 0;

    const currentMonthStatus =
      currentMonthPercentage >= 0 ? 'positive' : 'negative';

    return res.status(200).json({
      success: true,
      data: {
        userId,
        overall: {
          total,
          percentage,
          percentStatus,
          totalIncome,
          totalExpense,
          totalSplit,
        },
        currentMonth: {
          income: currentMonthIncome,
          expense: currentMonthExpense,
          split: currentMonthSplit,
          total: currentMonthTotal,
          percentage: currentMonthPercentage,
          percentStatus: currentMonthStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

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
    const { userId } = req.params;

    const splitData = await SplitModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const unpaidCount = splitData.reduce((total, item) => {
      const unpaidInItem =
        item.splitData?.filter((split) => split.paidStatus === 'unpaid')
          .length || 0;
      return total + unpaidInItem;
    }, 0);

    return res.status(200).json({
      success: true,
      unpaidCount,
      data: splitData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSplit = async (req, res, next) => {
  try {
    const { userId, paidStatus, splitId, amount } = req.body;

    const result = await SplitModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        'splitData._id': new mongoose.Types.ObjectId(splitId),
      },
      {
        $set: {
          'splitData.$.paidStatus': paidStatus,
        },
      },
      {
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Split data not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Paid status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
        role: user.role, // ✅ ADD THIS
        gender: user.gender || null,
        dob: user.dob || null,
        mobile: user.mobile || null,
        address: user.address || null,

        location: {
          city: user.location?.city || null,
          state: user.location?.state || null,
        },

        profilePic: user.profilePic || null,
        isVerified: user.isVerified || false,
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
        gender: user.gender || null,
        dob: user.dob || null,
        mobile: user.mobile || null,
        address: user.address || null,

        location: {
          city: user.location?.city || null,
          state: user.location?.state || null,
        },

        profilePic: user.profilePic || null,
        isVerified: user.isVerified || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(
        'name email role profilePic gender dob mobile address location createdAt'
      )
      .lean();

    // 🔥 Ensure location always exists (frontend safe)
    const formattedUsers = users.map((u) => ({
      ...u,
      location: {
        city: u.location?.city || '',
        state: u.location?.state || '',
      },
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select(
      '-otp -otpExpire -tokens'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { mobile, address, dob, gender, city, state } = req.body;

    // ✅ OPTIONAL TEXT FIELDS
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    if (city || state) {
      user.location = {
        city: city || user.location?.city,
        state: state || user.location?.state,
      };
    }

    // ✅ PROFILE IMAGE
    if (req.file) {
      user.profilePic = `/uploads/profile/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
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
