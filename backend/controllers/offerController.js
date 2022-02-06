import asyncHandler from 'express-async-handler'
import Offer from '../models/offerModel.js'
import Product from '../models/productModel.js'

// @desc    Add an offer
// @route   POST /api/offer
// @access  Private/ Admin
const addOffer = asyncHandler(async (req, res) => {
  const { title, discountPercentage, active, category } = req.body

  const offer = new Offer({
    title,
    discountPercentage,
    active,
    category,
  })
  await offer.save()

  if (offer.active) {
    if (offer.category === 'all') {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = offer.discountPercentage
        await product.save()
      })
    } else {
      const products = await Product.find({ category: offer.category })
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = offer.discountPercentage
          await product.save()
        })
      } else {
      }
    }
  }

  res.status(201).json(offer)
})

// @desc    Update an offer
// @route   PUT /api/offer/:offerId
// @access  Private/ Admin
const updateOffer = asyncHandler(async (req, res) => {
  const offerId = req.params.offerId

  const offer = await Offer.findById(offerId)

  const title = req.body.title || offer.title
  const active =
    req.body.active !== 'undefined' ? req.body.active : offer.active
  const discountPercentage =
    req.body.discountPercentage || offer.discountPercentage
  const category = req.body.category || offer.category

  offer.title = title
  offer.discountPercentage = discountPercentage
  offer.active = active
  offer.category = category

  await offer.save()

  if (offer.active) {
    if (offer.category.length === 0) {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = offer.discountPercentage
        await product.save()
      })
    } else {
      const products = await Product.find({ category: offer.category })
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = offer.discountPercentage
          await product.save()
        })
      } else {
      }
    }
  } else {
    if (offer.category === 'all') {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = 0
        await product.save()
      })
    } else {
      const products = await Product.find({ category: offer.category })
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = 0
          await product.save()
        })
      } else {
      }
    }
  }

  res.json(offer)
})

// @desc    Get all offers
// @route   GET /api/offer
// @access  Private/ Admin
const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({})

  res.json(offers)
})

// @desc    Get one offer
// @route   GET /api/offer/:offerId
// @access  Private/ Admin
const getOfferById = asyncHandler(async (req, res) => {
  const offerId = req.params.offerId
  const offer = await Offer.findById(offerId)
  res.json(offer)
})

// @desc    Delete an offer
// @route   DELETE /api/offer/:offerId
// @access  Private/ Admin
const deleteOffer = asyncHandler(async (req, res) => {
  await Offer.deleteOne({ _id: req.params.offerId })

  res.json('deleted successfully')
})

export { addOffer, updateOffer, getOffers, deleteOffer, getOfferById }
