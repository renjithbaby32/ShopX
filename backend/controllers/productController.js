import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import cloudinary from 'cloudinary'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 6
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}
  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//function to get all the products
const getAllProductsForReport = asyncHandler(async (req, res) => {
  const products = await Product.find()
  res.json({ products })
})

// @desc    Get products by category
// @route   GET /api/products/category:id
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.id,
  })

  res.json({ products })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    discountPrice: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    images: [],
    brand: 'Sample brand',
    category: 'Sample category',
    subCategory: 'unavailbale',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    discountPrice,
    description,
    image,
    brand,
    category,
    subCategory,
    rating,
    countInStock,
    numReviews,
  } = req.body

  let images = []
  if (typeof req.body.images === 'string') {
    images.push(req.body.images)
  } else {
    images = req.body.images
  }

  let imagesLinks = []

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products',
      // width: 150,
      // height: 150,
      crop: 'scale',
    })
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    })
  }
  req.body.images = imagesLinks

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.discountPrice = discountPrice
    product.description = description
    product.image = image
    product.extraImages = req.body.images
    product.brand = brand
    product.category = category
    product.subCategory = subCategory
    product.countInStock = countInStock
    product.rating = rating
    product.numReviews = numReviews

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(6)

  res.json(products)
})

// @desc    Get all the products that are on discount
// @route   GET /api/products/productsOnDiscount
// @access  Public
const getProductsOnDiscount = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ discountPrice: -1 }).limit(4)

  res.json(products)
})

// @desc    Get the total number of products and the number of products in each category
// @route   GET /api/products/dashboard
// @access  Private/Admin
const dashboard = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  const length = products.length
  let smartphone = 0
  let laptop = 0
  let others = 0

  products.forEach((product) => {
    if (product.category === 'smartphone') {
      smartphone++
    } else if (product.category === 'laptop') {
      laptop++
    } else {
      others++
    }
  })

  res.json({ length, smartphone, laptop, others })
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductsByCategory,
  getProductsOnDiscount,
  getAllProductsForReport,
  dashboard,
}
