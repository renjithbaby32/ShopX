import React, { useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { deleteFromWishlist, listWishlist } from '../actions/userActions'
import Loader from '../components/Loader'

const CartScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const wishlist = useSelector((state) => state.wishlist)
  const { loading, error, wishlistItems, successDelete } = wishlist

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      dispatch(listWishlist())
    }
  }, [dispatch, successDelete])

  const removeFromWishListHandler = (productId) => {
    dispatch(deleteFromWishlist(productId))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  return (
    <>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {wishlistItems && (
        <Row>
          <Col>
            <h1>Wishlist</h1>
            {wishlistItems.length === 0 ? (
              <Message>
                Your wishlist is empty <Link to="/">Go Back</Link>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {wishlistItems.map((item) => (
                  <ListGroup.Item key={item.name}>
                    <Row>
                      <Col md={1}>
                        <Link to={`/product/${item._id}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Link>
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        &#x20b9;
                        {item.discountPrice > 0
                          ? item.price -
                            item.discountPrice * 0.01 * item.price +
                            `(${item.discountPrice}% off)`
                          : item.price}
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromWishListHandler(item._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          variant="light"
                          // onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      )}
    </>
  )
}

export default CartScreen
