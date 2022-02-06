import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'

// @desc    Add an item to the cart
// @route   POST /api/cart
// @access  Private
const addCartItem = asyncHandler(async (req, res) => {
  const { user, product, price, image, countInStock, qty, name } = req.body

  if (product && product.length === 0) {
    res.status(400)
    throw new Error('No cart items')
  } else {
    const item = new Cart({
      user,
      product,
      price,
      image,
      countInStock,
      qty,
      name,
    })
    const createdCartItem = await item.save()

    res.status(201).json(createdCartItem)
  }
})

// @desc    Get itmes in the cart
// @route   GET /api/cart/:userId
// @access  Private
const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const cartItems = await Cart.find({ user: userId })

  res.status(200).json(cartItems)
})

// @desc    Delete an item from the cart
// @route   DELETE /api/cart/:userId
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const productId = req.query.productId
  const cartItems = await Cart.deleteOne({ user: userId, product: productId })

  res.json('deleted')
})

// @desc    Delete all items from the cart after checkout
// @route   DELETE /api/cart/checkout/:userId
// @access  Private
const deleteItems = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const cartItems = await Cart.deleteMany({ user: userId })

  res.json('deleted all items')
})

export { addCartItem, getCartItems, deleteItem, deleteItems }
