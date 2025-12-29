import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({

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
        ref: 'IncomeCategory',
        required: false,
    },
    note: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        required: false
    },
 


},
    { timestamps: true }
)

const IncomeModel = mongoose.model('income', incomeSchema)
export default IncomeModel;




const expenseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },

    note: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    expenseCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'ExpenseCategory',
        required: false,
    },

},
    { timestamps: true }
)

export const ExpenseModel = mongoose.model('expense', expenseSchema)


const splitSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: false
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
            paidStatus: {
                type: String,
                required: false,
                enum: ['paid', 'unpaid'],
                default: 'unpaid'
            }
        }
    ]


},
    { timestamps: true }
)

export const SplitModel = mongoose.model('split', splitSchema)