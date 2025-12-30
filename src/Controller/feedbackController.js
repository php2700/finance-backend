import { response } from 'express';
import Feedback, { AboutUsModel, PrivacyPolicyModel } from '../Models/feedbackModel.js';
import userModel from '../Models/userModel.js';
import incomeCategoryModel from '../Models/incomeCategoryModel.js';
import ExpenseCategory from '../Models/ExpenseCategory.js';

/**
 * ✅ User creates feedback
 */
export const createFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body || {};
    console.log('BODY:', req.body);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Feedback message is required',
      });
    }

    const feedback = await Feedback.create({
      user: req.userId,
      message,
      rating,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ User can see his own feedbacks
 */
export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Admin can see all users feedback
 */
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPrivacyPolicy = async (req, res, next) => {
  try {
    const privacypolicy = await PrivacyPolicyModel.findOne()

    res.status(200).json({
      success: true,
      data: privacypolicy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const count = async (req, res, next) => {
  try {
    const userCount = await userModel.countDocuments();
    const incomeCategoryCount=await incomeCategoryModel.countDocuments()
    const expenseCategoryCount=await ExpenseCategory.countDocuments()
    return res.status(200).json({ success: true, userCount: userCount,incomeCategoryCount,expenseCategoryCount })
  } catch (error) {
    next(error)
  }
}

export const getAboutUs = async (req, res, next) => {
  try {
    const aboutUs = await AboutUsModel.findOne()

    res.status(200).json({
      success: true,
      data: aboutUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const privacyPolicy = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Privacy policy data is required",
      });
    }

    const privacypolicy = await PrivacyPolicyModel.findOneAndUpdate(
      {},                   // find any existing record
      { data },          // update data
      {
        new: true,           // return updated document
        upsert: true,        // create if not exists
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: privacypolicy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const aboutUs = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "about data is required",
      });
    }

    const aboutData = await AboutUsModel.findOneAndUpdate(
      {},                   // find any existing record
      { data },          // update data
      {
        new: true,           // return updated document
        upsert: true,        // create if not exists
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: aboutData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
