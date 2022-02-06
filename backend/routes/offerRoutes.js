import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  addOffer,
  getOffers,
  updateOffer,
  deleteOffer,
  getOfferById,
} from '../controllers/offerController.js'

router
  .route('/:offerId')
  .get(protect, admin, getOfferById)
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer)
router.route('/').post(protect, admin, addOffer).get(getOffers)

export default router
