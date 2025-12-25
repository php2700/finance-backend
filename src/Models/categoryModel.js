import mongoose from "mongoose";

const incomeCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
        trim: true,
    },
   image:{
      type: String,
        required: false,
   }
},
    { timestamps: true }
)

const IncomeCategoryModel = mongoose.model('incomeCategoy', incomeCategorySchema)
export default IncomeCategoryModel;

const expenseCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
        trim: true,
    },
   image:{
      type: String,
        required: false,
   }
},
    { timestamps: true }
)

export const ExpenseCategoryModel = mongoose.model('expenseCategoy', expenseCategorySchema)