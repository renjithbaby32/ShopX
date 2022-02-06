import express from 'express'
import { addAddress, getAddresses } from '../controllers/addressController.js'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/:userId').post(addAddress).get(getAddresses)

export default router
