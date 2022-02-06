import mongoose from 'mongoose'

const walletSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
)

const Wallet = mongoose.model('Wallet', walletSchema)

export default Wallet
