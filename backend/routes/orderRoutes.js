import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  report,
  updateOrderToDispatched,
  updateOrderToOutForDelivery,
  cancelOrder,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/report').get(report)
router.route('/report/:id').get(report)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/:id/dispatch').put(protect, admin, updateOrderToDispatched)
router.route('/:id/cancel').put(protect, cancelOrder)
router
  .route('/:id/outfordelivery')
  .put(protect, admin, updateOrderToOutForDelivery)

export default router
