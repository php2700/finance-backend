import mongoose from 'mongoose';

const incomeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // ❌ duplicate name not allowed
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('IncomeCategory', incomeCategorySchema);
