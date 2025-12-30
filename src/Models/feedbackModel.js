import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;




const privacyPolicySchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
    }

  },
  { timestamps: true }
);

export const PrivacyPolicyModel = mongoose.model('privacyPolicy', privacyPolicySchema);


const aboutUsSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
    }

  },
  { timestamps: true }
);

export const AboutUsModel = mongoose.model('aboutus', aboutUsSchema);