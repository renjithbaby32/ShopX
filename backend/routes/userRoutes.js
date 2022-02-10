import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addItemToWishlist,
  getWishListItems,
  deleteItemFromWishlist,
  checkReferralId,
  addReferralId,
  getReferralId,
  showWalletBalance,
  deductWalletBalance,
  forgotPassword,
  updateUserPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/forgotPassword').post(forgotPassword).put(updateUserPassword)
router.put('/wallet/:amount', protect, deductWalletBalance)
router.route('/wallet').get(protect, showWalletBalance)
router
  .route('/referral')
  .get(protect, getReferralId)
  .post(protect, addReferralId)
  .put(protect, checkReferralId)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router.route('/wishlist').get(protect, getWishListItems)
router
  .route('/wishlist/:productId')
  .post(protect, addItemToWishlist)
  .delete(protect, deleteItemFromWishlist)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
