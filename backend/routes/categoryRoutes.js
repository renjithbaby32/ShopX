import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getCategories,
  addCategory,
} from '../controllers/categoryController.js'

router.route('/').get(getCategories).post(addCategory)

export default router
