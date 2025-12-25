import TransactionModel from "../Models/transaction.js"

export const AddTransction = async (req, res, next) => {
    try {
        const transaction = new TransactionModel(req.body);
        await transaction.save();
        return res.status(201).json({
            success: true,
            message: 'Transaction added successfully',
            data: transaction
        });
    } catch (error) {
        next(error)
    }
}