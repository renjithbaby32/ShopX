import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import SubCategory from '../models/subCategoryModel.js'

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const data = await Category.find({})
  res.json(data)
})

// @desc    Fetch all sub categories
// @route   GET /api/categories/subcategories
// @access  Public
export const getAllSubCategories = asyncHandler(async (req, res) => {
    const data = await SubCategory.find({})
    res.json(data)
  })

// @desc    Fetch all sub categories under a category
// @route   GET /api/categories/subcategories/:id
// @access  Public
export const getAllSubCategoriesUnder = asyncHandler(async (req, res) => {
  const data = await SubCategory.find({parentCategory:req.params.id})
  res.json(data)
})

// @desc    Add one category
// @route   POST /api/categories
// @access  Public
export const addCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  })
  const data = category.save()
  res.json({
    message: 'category added successfully',
  })
})

// @desc    Add one sub category
// @route   POST /api/categories/subcategory
// @access  Public
export const addSubCategory = asyncHandler(async (req, res) => {
    const subCategory = new SubCategory({
      name: req.body.name,
      description: req.body.description,
      parentCategory: req.body.parentCategory
    })
    const data = subCategory.save()
    res.json({
      message: 'sub-category added successfully',
    })
  })