import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col } from 'react-bootstrap'
import Rating from './Rating'
import {
  addToWishList,
  deleteFromWishlist,
  listWishlist,
} from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

const Product = ({ product, wishlist = [] }) => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const addItemToWishListHandler = (e) => {
    e.target.style.color = e.target.style.color === 'red' ? '#55595c' : 'red'
    if (e.target.style.color === 'red') {
      dispatch(addToWishList(product._id))
    } else {
      dispatch(deleteFromWishlist(product._id))
    }
  }

  let test = false
  wishlist.filter((item) => {
    if (item._id === product._id) {
      test = true
    }
  })

  return (
    <>
      <Card className="my-1 p-3 rounded mb-3">
        <div>
          <div className="like-button" title="Add to favourites">
            {userInfo && (
              <i
                onClick={addItemToWishListHandler}
                className="fa fa-heart"
                style={{
                  color: test ? 'red' : '#55595c',
                }}
              ></i>
            )}

            {product.discountPrice > 0 && (
              <span className="float-right" style={{ color: 'green' }}>
                {product.discountPrice}% off
              </span>
            )}
          </div>

          <Link to={`/product/${product._id}`}>
            <Card.Img
              src={product.image}
              variant="top"
              className="card-image"
            />
          </Link>
        </div>

        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </Card.Text>

          {product.discountPrice ? (
            <Row className="price-row">
              <Col>
                <h5>
                  &#x20b9;
                  {Math.floor(
                    product.price - product.price * 0.01 * product.discountPrice
                  )}
                </h5>
              </Col>
              <Col>
                <Card.Text as="h5">
                  <s>&#x20b9;{Math.floor(product.price)}</s>
                </Card.Text>
              </Col>
            </Row>
          ) : (
            <Card.Text className="price-row" as="h5">
              &#x20b9;{product.price}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default Product
