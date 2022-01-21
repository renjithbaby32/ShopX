import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Private/Admin
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
  res.json(categories)
})
