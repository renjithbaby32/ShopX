import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import { getCategories } from '../controllers/categoryController.js'

router.route('/').get(getCategories)

export default router
