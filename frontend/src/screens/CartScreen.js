import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import {
  addToCart,
  listCartItems,
  removeFromCart,
} from '../actions/cartActions'

const CartScreen = () => {
  const data = useParams()
  const productId = data.id
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const qty = Number(searchParams.get('qty')) || 1

  const alert = useAlert()

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    if (productId) {
      dispatch(addToCart(productId, qty))
    } else {
      dispatch(listCartItems())
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    if (
      window.confirm('Are you sure you want to remove this item from cart?')
    ) {
      dispatch(removeFromCart(id))
      alert.success('Item has been removed from cart')
    }
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    &#x20b9;
                    {item.product.discountPrice > 0
                      ? item.product.price -
                        item.product.discountPrice * 0.01 * item.product.price +
                        `(${item.product.discountPrice}% off)`
                      : item.product.price}
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              &#x20b9;
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc +
                    item.qty *
                      (item.product.discountPrice
                        ? item.product.price -
                          item.product.discountPrice * 0.01 * item.product.price
                        : item.product.price),
                  0
                )
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
