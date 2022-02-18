import mongoose from 'mongoose'
import User from '../models/userModel.js'
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // discount will be in rupees, not in percentage
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
