import IncomeModel, { ExpenseModel, SplitModel, TransactionModel } from '../Models/transaction.js';
import { isValidEmail } from '../utils/validateEmail.js';
import User from '../Models/userModel.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../envconfig.js';
import mongoose from 'mongoose';
import { Parser } from "json2csv";


export const AddIncome = async (req, res, next) => {
  try {
    const transaction = new TransactionModel(req.body);
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

    if (transactionType === "income") {
      const incomeTransaction = await IncomeModel.find({
        userId: objectUserId
      })
        .populate("incomeCategoryId")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: incomeTransaction
      });
    }

    if (transactionType === "expense") {
      const expenseTransaction = await ExpenseModel.find({
        userId: objectUserId
      }).populate("expenseCategoryId").sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: expenseTransaction
      });
    }


    const [income, expense] = await Promise.all([
      IncomeModel.find({ userId: objectUserId })
        .populate({
          path: "incomeCategoryId",
          select: "name image"
        })
        .lean(),

      ExpenseModel.find({ userId: objectUserId })
        .populate({
          path: "expenseCategoryId",
          select: "name image"
        })
        .lean()
    ]);

    const incomeWithType = income.map(item => ({
      ...item,
      transactionType: "income"
    }));

    const expenseWithType = expense.map(item => ({
      ...item,
      transactionType: "expense"
    }));

    const allTransactions = [...incomeWithType, ...expenseWithType]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    return res.status(200).json({
      success: true,
      data: allTransactions
    });

  } catch (error) {
    next(error);
  }
};

export const downloadCsv = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { userId } = req.params;

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const createdAtFilter = {};

    if (startDate && endDate) {
      createdAtFilter.$gte = new Date(`${startDate}T00:00:00.000Z`);
      createdAtFilter.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }

    const [income, expense] = await Promise.all([
      IncomeModel.find({
        userId: objectUserId,
        ...(startDate && endDate && { createdAt: createdAtFilter })
      })
        .populate("incomeCategoryId", "name")
        .lean(),

      ExpenseModel.find({
        userId: objectUserId,
        ...(startDate && endDate && { createdAt: createdAtFilter })
      })
        .populate("expenseCategoryId", "name")
        .lean()
    ]);

    const incomeWithType = income.map(item => ({
      date: item.createdAt,
      amount: item.amount,
      category: item.incomeCategoryId?.name || "",
      note: item.note || "",
      transactionType: "income"
    }));

    const expenseWithType = expense.map(item => ({
      date: item.createdAt,
      amount: item.amount,
      category: item.expenseCategoryId?.name || "",
      note: item.note || "",
      transactionType: "expense"
    }));

    const allTransactions = [...incomeWithType, ...expenseWithType].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const fields = [
      { label: "Date", value: "date" },
      { label: "Type", value: "transactionType" },
      { label: "Amount", value: "amount" },
      { label: "Category", value: "category" },
      { label: "Note", value: "note" }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(allTransactions);

    res.header("Content-Type", "text/csv");
    res.attachment(`transactions_${Date.now()}.csv`);
    return res.send(csv);

  } catch (error) {
    next(error);
  }
};


export const monthTransaction = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23, 59, 59, 999
    );

    // 🔹 Fetch both sorted by insertion time
    const [income, expense] = await Promise.all([
      IncomeModel.find({
        userId: objectUserId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      })
        .populate("incomeCategoryId", "name image")
        .sort({ createdAt: 1 }) // ⬅ oldest → newest
        .lean(),

      ExpenseModel.find({
        userId: objectUserId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      })
        .populate("expenseCategoryId", "name image")
        .sort({ createdAt: 1 }) // ⬅ oldest → newest
        .lean()
    ]);

    // 🔹 Add transaction type
    const incomeWithType = income.map(item => ({
      ...item,
      transactionType: "income"
    }));

    const expenseWithType = expense.map(item => ({
      ...item,
      transactionType: "expense"
    }));

    // 🔹 Merge WITHOUT sorting again
    const allTransactions = [...incomeWithType, ...expenseWithType]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

    return res.status(200).json({
      success: true,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalTransactions: allTransactions.length,
      data: allTransactions
    });

  } catch (error) {
    next(error);
  }
};

export const dashboard = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [incomeAgg, expenseAgg, splitSum, splitAgg] = await Promise.all([
      // Total income
      TransactionModel.aggregate([
        { $match: { userId: objectUserId, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // Total expense
      TransactionModel.aggregate([
        { $match: { userId: objectUserId, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // Total paid split amounts (from others)
      TransactionModel.aggregate([
        { $match: { userId: objectUserId, type: "split" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
    SplitModel.aggregate([
  {
    $match: {
      userId: objectUserId
    }
  },
  {
    $project: {
      splitAmount: {
        $sum: {
          $map: {
            input: {
              $filter: {
                input: "$splitData",
                as: "s",
                cond: { $ne: ["$$s.name", "you"] } // only include names not "you"
              }
            },
            as: "s",
            in: "$$s.splitAmount"
          }
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      totalSplitAmount: { $sum: "$splitAmount" } // sum across all documents
    }
  }
])

    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;
    const totalSplit = splitSum[0]?.total || 0
    const totalPaidSplitAmount = splitAgg[0]?.totalSplitAmount || 0;

    const income=totalIncome + totalPaidSplitAmount
    const overallTotal =income  - totalExpense - totalSplit;
    const overallPercentage = totalIncome > 0 ? Number(((overallTotal / income) * 100).toFixed(2)) : 0;
    const overallStatus = overallPercentage >= 0 ? "positive" : "negative";

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const currentMonthMatch = {
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth }
    };

    const [incomeMonth, expenseMonth, splitMonth] = await Promise.all([
      TransactionModel.aggregate([
        { $match: { ...currentMonthMatch, userId: objectUserId, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      TransactionModel.aggregate([
        { $match: { ...currentMonthMatch, userId: objectUserId, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      SplitModel.aggregate([
        { $match: { ...currentMonthMatch, userId: objectUserId, paidStatus: "paid", name: { $ne: "you" } } },
        { $group: { _id: null, totalPaidSplitAmount: { $sum: "$splitAmount" } } }
      ])
    ]);

    const currentMonthIncome = incomeMonth[0]?.total || 0;
    const currentMonthExpense = expenseMonth[0]?.total || 0;
    const currentMonthPaidSplitAmount = splitMonth[0]?.totalPaidSplitAmount || 0;

    const currentMonthTotal = currentMonthIncome + currentMonthPaidSplitAmount - currentMonthExpense;
    const currentMonthPercentage = currentMonthIncome > 0
      ? Number(((currentMonthTotal / currentMonthIncome) * 100).toFixed(2))
      : 0;
    const currentMonthStatus = currentMonthPercentage >= 0 ? "positive" : "negative";

    // --------------------------
    // 3️⃣ Return response
    // --------------------------
    return res.status(200).json({
      success: true,
      data: {
        userId,
        overall: {
          total: overallTotal,
          percentage: overallPercentage,
          percentStatus: overallStatus,
          totalIncome,
          totalExpense,
          totalPaidSplitAmount
        },
        currentMonth: {
          income: currentMonthIncome,
          expense: currentMonthExpense,
          totalPaidSplitAmount: currentMonthPaidSplitAmount,
          total: currentMonthTotal,
          percentage: currentMonthPercentage,
          percentStatus: currentMonthStatus
        }
      }
    });

  } catch (error) {
    next(error);
  }
};





export const AddExpense = async (req, res, next) => {
  try {
    const expense = new TransactionModel(req.body);
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
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const splitData = await TransactionModel.aggregate([
      {
        $match: {
          userId: objectUserId,
          type: "split"
        }
      },

      {
        $lookup: {
          from: "splits",
          localField: "_id",
          foreignField: "trnasactionId",
          as: "splits"
        }
      },

      { $sort: { createdAt: -1 } }
    ]);


    const unpaidCount = splitData.reduce((count, txn) => {
      const unpaid = txn.splits.filter(
        s => s.paidStatus === "unpaid"
      ).length;
      return count + unpaid;
    }, 0);

    return res.status(200).json({
      success: true,
      unpaidCount,
      data: splitData
    });

  } catch (error) {
    next(error);
  }
};



export const updateSplit = async (req, res, next) => {
  try {
    const { paidStatus, splitId, amount, trnasactionId } = req.body;

    const result = await SplitModel.findById(splitId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Split data not found"
      });
    }

    result.paidStatus = paidStatus;
    result.amount = amount;

    await result.save();
    return res.status(200).json({
      success: true,
      message: "Paid status updated successfully",
      data: result
    });

  } catch (error) {
    next(error);
  }
};


export const AddSplit = async (req, res, next) => {
  try {
    const { userId, amount, note, type, splitData } = req.body;

    // 1️⃣ Create transaction
    const transaction = await TransactionModel.create({
      userId,
      amount,
      note,
      type: type
    });

    // 2️⃣ Prepare split documents
    const splitDocs = splitData.map(item => ({
      trnasactionId: transaction._id, // typo kept as per schema
      name: item.name,
      userId: userId,
      splitAmount: item.splitAmount,
      paidStatus: item.paidStatus
    }));

    // 3️⃣ Insert all split users
    await SplitModel.insertMany(splitDocs);

    return res.status(201).json({
      success: true,
      message: "Split transaction added successfully",
      transactionId: transaction._id, userId
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
    // console.log('🔥 GET /api/user hit');
    const users = await User.find().select('-otp -otpExpire');
    res.status(200).json({
      success: true,
      users,
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
