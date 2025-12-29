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

const splitItemSchema = new mongoose.Schema(
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
            enum: ["paid", "unpaid"],
            default: "unpaid"
        }
    },
    {
        timestamps: true
    }
);

const splitSchema = new mongoose.Schema({

    trnasactionId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'transaction'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'user'
    },
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
        enum: ["paid", "unpaid"],
        default: "unpaid"
    }
},
    { timestamps: true }
)

export const SplitModel = mongoose.model('split', splitSchema)



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
    incomeCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'IncomeCategory',
        required: false,
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'split'],
        default: 'income'
    },


},
    { timestamps: true }
)

export const TransactionModel = mongoose.model('transaction', transactionSchema)
