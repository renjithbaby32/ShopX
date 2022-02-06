import asyncHandler from 'express-async-handler'
import Address from '../models/addressModel.js'

// @desc    Add an address
// @route   POST /api/address/:userId
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const { address, postalCode, country, city } = req.body

  const newAddress = new Address({
    address,
    city,
    postalCode,
    country,
    user: userId,
  })
  await newAddress.save()

  res.status(201).json(newAddress)
})

// @desc    Get the addresses of a user
// @route   GET /api/address/:userId
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.params.userId

  const address = await Address.find({ user: userId })

  res.json(address)
})

export { addAddress, getAddresses }
