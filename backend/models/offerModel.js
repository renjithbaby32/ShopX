import mongoose from 'mongoose'
const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Offer = mongoose.model('Offer', offerSchema)

export default Offer
