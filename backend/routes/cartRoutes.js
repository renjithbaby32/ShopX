import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  addCartItem,
  getCartItems,
  deleteItem,
  deleteItems,
} from '../controllers/cartController.js'

router.route('/').post(protect, addCartItem)
router.route('/checkout/:userId').delete(protect, deleteItems)
router.route('/:userId').get(protect, getCartItems).delete(protect, deleteItem)

export default router
