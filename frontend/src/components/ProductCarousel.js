import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import {
  listProductsOnDiscount,
  listTopProducts,
} from '../actions/productActions'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productsOnDiscount = useSelector((state) => state.productsOnDiscount)
  const { loading, error, products } = productsOnDiscount

  useEffect(() => {
    dispatch(listProductsOnDiscount())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel
      indicators={false}
      controls={false}
      pause="hover"
      variant="dark"
      style={{
        backgroundColor: 'rgb(187 193 237 / 40%)',
        marginBottom: '50px',
      }}
    >
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              roundedCircle={false}
              src={product.image}
              alt={product.name}
              fluid
            />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (&#x20b9;
                {product.discountPrice > 0
                  ? product.price - product.price * 0.01 * product.discountPrice
                  : product.price}
                )
                {product.discountPrice > 0 &&
                  ' On ' + product.discountPrice + '% discount'}
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
