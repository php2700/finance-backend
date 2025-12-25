import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    incomeCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'incomeCategoy',
        required: false,
    },
    note: {
        type: String,
        required: false
    },
    transactionType: {
        type: String,
        enum: ['income', 'expense', 'split'],
        default: 'income'
    },
    date: {
        type:Date,
        required: false
    },
    expenseCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'expenseCategoy',
        required: false,
    },
    splitData: [
        {
            name: {
                type: String,
                required: false
            },
            splitAmount: {
                type: Number,
                required: false
            },
            paidStatus:{
                type:String,
                required:false,
                enum:['paid','unpaid'],
                default:'unpaid'
            }
        }
    ]


},
    { timestamps: true }
)

const TransactionModel = mongoose.model('transaction', transactionSchema)
export default TransactionModel;