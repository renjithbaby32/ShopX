import asyncHandler from 'express-async-handler'
import Coupon from '../models/couponModel.js'
import Order from '../models/orderModel.js'

// @desc Add a new coupon
// @route POST /api/coupon
// @access Private/Admin
const addCoupon = asyncHandler(async (req, res) => {
  const { name, discount } = req.body
  const newCoupon = new Coupon({
    name,
    discount,
  })

  // return res.json(newCoupon)
  const savedCoupon = await newCoupon.save()
  res.json(savedCoupon)
})

// @desc Apply coupon to an order and update the users array in the Coupon collection
// @route PUT /api/coupon
// @access Public
const applyCouponToTheOrder = asyncHandler(async (req, res) => {
  const { couponId, user } = req.body
  const coupon = await Coupon.findById(couponId)
  let updatedCoupon
  if (coupon) {
    if (coupon.users.includes(user)) {
      res.json({
        error: 'You have already used this coupon',
      })
    } else {
      coupon.users.push(user)
      updatedCoupon = await coupon.save()
      res.json(updatedCoupon)
    }
  } else {
    res.json('Coupon does not exist')
  }
})

// @desc Get the list of all coupons
// @route GET /api/coupon
// @access Public
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({})
  res.json(coupons)
})

// @desc Delete a coupon
// @route DELETE /api/coupon
// @access Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.couponId
  const coupon = await Coupon.deleteOne({ _id: couponId })
  if (coupon) {
    res.json('Coupon deleted successfully')
  } else {
    res.json('Coupon does not exist')
  }
})

export { addCoupon, applyCouponToTheOrder, getAllCoupons, deleteCoupon }
