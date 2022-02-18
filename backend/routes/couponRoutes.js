import express from 'express'
import {
  addCoupon,
  applyCouponToTheOrder,
  getAllCoupons,
  deleteCoupon,
} from '../controllers/couponController.js'
const router = express.Router()

router.route('/').post(addCoupon).put(applyCouponToTheOrder).get(getAllCoupons)

router.route('/:couponId').delete(deleteCoupon)
export default router
