import mongoose from 'mongoose';

const incomeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // ❌ duplicate name not allowed
      trim: true,
    },
    image: {
      type: String, // image ka path store hoga
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('IncomeCategory', incomeCategorySchema);
