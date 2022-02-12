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

// @desc    Find one address
// @route   GET /api/address/:addressId
// @access  Private
const getAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId

  const address = await Address.findById(addressId)

  res.json(address)
})

// @desc    Delete an address
// @route   DELETE /api/address/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId

  await Address.deleteOne({ _id: addressId })

  res.json('success')
})

// @desc    Update an address
// @route   PUT /api/address/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId

  const address = await Address.findById(addressId)

  address.address = req.body.address
  address.city = req.body.city
  address.postalCode = req.body.postalCode
  address.city = req.body.city

  await address.save()
  res.json('updated')
})

export { addAddress, getAddresses, deleteAddress, updateAddress, getAddress }
