import express from 'express'
import {
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  getAddress,
} from '../controllers/addressController.js'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/:userId').post(protect, addAddress).get(protect, getAddresses)

router
  .route('/ind/:addressId')
  .delete(protect, deleteAddress)
  .put(protect, updateAddress)
  .get(protect, getAddress)
export default router
