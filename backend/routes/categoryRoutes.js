import express from 'express'
const router = express.Router()

import {
  getAllCategories,
  addCategory,
  addSubCategory,
  getAllSubCategoriesUnder,
} from '../controllers/categoryController.js'

router.route('/').get(getAllCategories).post(addCategory)
router.route('/subcategories').post(addSubCategory)
router.route('/subcategories/:id').get(getAllSubCategoriesUnder)

export default router
