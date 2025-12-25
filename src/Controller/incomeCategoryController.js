import IncomeCategory from '../Models/incomeCategoryModel.js';

/* ================= CREATE CATEGORY ================= */
export const createIncomeCategory = async (req, res, next) => {
  try {
    const { name } = req?.body;
    console.log('REQ HEADERS:', req.headers['content-type']);
    console.log('REQ BODY:', req.body);
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const exists = await IncomeCategory.findOne({
      name: name.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await IncomeCategory.create({
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Income category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL CATEGORIES ================= */
export const getIncomeCategories = async (req, res, next) => {
  try {
    const categories = await IncomeCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET SINGLE CATEGORY ================= */
export const getIncomeCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await IncomeCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE CATEGORY ================= */
export const updateIncomeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await IncomeCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) category.name = name.trim();
    if (typeof status === 'boolean') category.status = status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteIncomeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await IncomeCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
