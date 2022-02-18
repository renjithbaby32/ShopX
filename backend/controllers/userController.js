import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import ReferralId from '../models/referralIdModel.js'
import Wallet from '../models/walletModel.js'
import dotenv from 'dotenv'
import twilio from 'twilio'

dotenv.config()

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN

const client = twilio(accountSid, authToken)

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user.isBlocked) {
    // res.redirect('Blocked')
    res.status(401)
    throw new Error('You are blocked!')
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      phone: user.phone,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin
    user.isBlocked = req.body.isBlocked
    if (req.body.phone) {
      user.phone = req.body.phone
    } else {
      user.phone = 1212121212
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Add an item to the wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const addItemToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId
  const userId = req.user._id

  const user = await User.findById(userId)
  await user.wishlist.push(productId)
  await user.save()
  res.json({
    message: 'success',
  })
})

// @desc    Get all the wishlist items from a user document
// @route   GET /api/users/wishlist
// @access  Private
const getWishListItems = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const user = await User.findOne({ _id: userId }).populate(
    'wishlist',
    'name price image discountPrice'
  )
  res.json(user.wishlist)
})

// @desc    Delete an item from the wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private/Admin
const deleteItemFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId
  const userId = req.user._id

  const user = await User.findById(userId)
  await user.wishlist.pull(productId)
  await user.save()
  res.json({
    message: 'deleted successfully ',
  })
})

// @desc    Check if the given referral Id is valid
// @route   PUT /api/users/referral
// @access  Private
const checkReferralId = asyncHandler(async (req, res) => {
  const referralId = req.body.referralId
  const userId = req.user._id
  let parentUser
  let checked = false

  const referral = await ReferralId.find({})
  referral.forEach(async (item) => {
    if (item.referralId === referralId) {
      checked = true
      parentUser = item.user
      const wallet = new Wallet({
        user: userId,
        balance: 500,
      })
      await wallet.save()
      const test = await Wallet.findOneAndUpdate(
        {
          user: parentUser,
        },
        {
          $inc: { balance: 500 },
        },
        {
          new: true,
          upsert: true,
        }
      )
      res.json('success')
    }
  })

  if (!checked) {
    res.json('fail')
  }
})

// @desc    Add referral id
// @route   POST /api/users/referral
// @access  Private
const addReferralId = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const referralA = req.user.name.slice(0, 4)
  const referralB = req.user.email.slice(0, 4)
  const referral = referralA + referralB

  const referralId = new ReferralId({
    user: userId,
    referralId: referral,
  })

  await referralId.save()

  res.json('success')
})

// @desc    Get referral id
// @route   GET /api/users/referral
// @access  Private
const getReferralId = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const data = await ReferralId.find({
    user: userId,
  })
  res.json(data)
})

// @desc    Get wallet balance
// @route   GET /api/users/wallet
// @access  Private
const showWalletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const data = await Wallet.find({
    user: userId,
  })
  if (data.length > 0) {
    const response = data[0].balance
    res.json(response)
  } else {
    res.json(0)
  }
})

// @desc    Delete wallet balance
// @route   PUT /api/users/wallet
// @access  Private
const deductWalletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const amount = req.params.amount

  const test = await Wallet.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $inc: { balance: -amount },
    },
    {
      new: true,
    }
  )

  res.json('success')
})

// @desc    Get user profile by email and send OTP to phone number if the user forgets the password
// @route   POST /api/users/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000)
    client.messages
      .create({
        to: `+91${user.phone}`,
        from: process.env.TWILIO_NUMBER,
        body: otp,
      })
      .then((message) => console.log(message.sid))

    res.json({ userId: user._id, otp })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user password
// @route   PUT /api/users/forgotPassword
// @access  Public
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    user.password = req.body.password

    const updatedUser = await user.save()

    res.json('success')
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get details for the dashboard
// @route   GET /api/users/dashboard
// @access  Private/Admin
const dashboard = asyncHandler(async (req, res) => {
  const users = await User.find()
  const usersCount = users.length

  const users1 = await User.find({
    createdAt: {
      $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 4,
      $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 3,
    },
  })

  const users2 = await User.find({
    createdAt: {
      $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 3,
      $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 2,
    },
  })
  const users3 = await User.find({
    createdAt: {
      $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 2,
      $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 1,
    },
  })
  const users4 = await User.find({
    createdAt: {
      $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 1,
    },
  })

  const userNumbers = [
    users1.length,
    users2.length,
    users3.length,
    users4.length,
  ]

  res.json({
    usersCount,
    userNumbers,
  })
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addItemToWishlist,
  getWishListItems,
  deleteItemFromWishlist,
  checkReferralId,
  addReferralId,
  getReferralId,
  showWalletBalance,
  deductWalletBalance,
  forgotPassword,
  updateUserPassword,
  dashboard,
}
