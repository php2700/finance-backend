import ExpenseCategory from '../Models/ExpenseCategory.js';

/* ================= CREATE ================= */
export const createExpenseCategory = async (req, res) => {
  try {
    const { name } = req.body || {};

    if (!name)
      return res.status(400).json({ message: 'Category name is required' });

    const exists = await ExpenseCategory.findOne({ name });
    if (exists)
      return res.status(400).json({ message: 'Category already exists' });

    const category = await ExpenseCategory.create({
      name,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      message: 'Expense category created successfully',
      category,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find().sort({
      createdAt: -1,
    });

    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body || {};

    const category = await ExpenseCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    if (name !== undefined) category.name = name;
    if (status !== undefined) category.status = status;

    await category.save();

    res.status(200).json({
      message: 'Expense category updated successfully',
      category,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ExpenseCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();

    res.status(200).json({
      message: 'Expense category deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
