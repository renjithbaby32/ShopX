import mongoose from 'mongoose'

const referralIdModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    referralId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

const ReferralId = mongoose.model('ReferralId', referralIdModel)

export default ReferralId
