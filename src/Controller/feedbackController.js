import Feedback from '../Models/feedbackModel.js';

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
