import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, FormControl, ListGroup } from 'react-bootstrap'
import { Table, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import { useParams } from 'react-router-dom'
import { listCategories } from '../actions/categoryActions'
import CropImage from '../components/CropImage'

const ProductEditScreen = () => {
  const { id } = useParams()
  const productId = id
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)
  const [image, setImage] = useState('')
  const [images, setImages] = useState([])
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [rating, setRating] = useState('')
  const [numReviews, setNumReviews] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [cropImage, setCropImage] = useState(false)
  const [imageOne, setImageOne] = useState(null)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
        dispatch(listCategories())
      } else {
        setName(product.name)
        setPrice(product.price)
        setDiscountPrice(product.discountPrice)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setSubCategory(product.subCategory)
        setRating(product.rating)
        setNumReviews(product.numReviews)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, productId, product, successUpdate])

  const uploadFileHandler = async (image) => {
    const formData = new FormData()
    formData.append('image', image, image.originalname)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
  }

  const multiFileUploadHandler = async (e) => {
    const files = Array.from(e.target.files)
    setImages([])

    files.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const formData = new FormData()
    formData.set('name', name)
    formData.set('price', price)
    formData.set('discountPrice', discountPrice)
    formData.set('countInStock', countInStock)
    formData.set('image', image)
    formData.set('brand', brand)
    formData.set('rating', rating)
    formData.set('category', category)
    formData.set('subCategory', subCategory)
    formData.set('description', description)
    formData.set('numReviews', numReviews)
    images.forEach((image) => {
      formData.append('images', image)
    })
    dispatch(updateProduct(formData, productId))
    setSubmitted(false)
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      {submitted ? (
        <Loader />
      ) : (
        <>
          <FormContainer>
            <h1>Add/Edit Product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group className="py-1" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1" controlId="discountPrice">
                  <Form.Label>Discount Rate in Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter the discount rate"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    className="py-1"
                    type="text"
                    placeholder="Enter image url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  {/* <FormControl
                    type="file"
                    id="image-file"
                    label="Choose File"
                    custom
                    onChange={uploadFileHandler}
                  /> */}
                  <Form.Control
                    type="file"
                    name="imageOne"
                    onChange={(e) => {
                      setCropImage(e.target.files[0])
                      setShowCropper(true)
                    }}
                    accept=".jpg,.jpeg,.png,"
                  />

                  {uploading && <Loader />}
                </Form.Group>

                <Form.Group className="py-1">
                  <Form.Label>Add extra images</Form.Label>
                  <FormControl
                    type="file"
                    id="image-files"
                    label="Choose Files"
                    custom
                    multiple
                    onChange={multiFileUploadHandler}
                  />
                  {uploading && <Loader />}
                </Form.Group>

                <Form.Group className="py-1" controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <ListGroup.Item className="py-1">
                  <Row>
                    <Col>Category</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {categories.map((x) => (
                          <option key={x._id} value={x.name}>
                            {x.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <Form.Group className="py-1" controlId="brand">
                  <Form.Label>Sub-category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter sub-category"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1" controlId="countInStock">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter countInStock"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="Number"
                    placeholder="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="py-1" controlId="numReviews">
                  <Form.Label>Number of reviews</Form.Label>
                  <Form.Control
                    type="Number"
                    placeholder="Number of reviews"
                    value={numReviews}
                    onChange={(e) => setNumReviews(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="pb-3 py-1" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="info">
                  Update
                </Button>
              </Form>
            )}
          </FormContainer>
          {showCropper && (
            <CropImage
              src={cropImage}
              imageCallback={(image) => {
                setImageOne(image)
                setShowCropper(false)
                uploadFileHandler(image)
              }}
              closeHander={() => {
                setShowCropper(false)
              }}
            />
          )}
        </>
      )}
    </>
  )
}

export default ProductEditScreen
