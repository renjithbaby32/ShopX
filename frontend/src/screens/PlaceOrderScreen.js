import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  FormGroup,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { deductFromWallet, showWalletBalance } from '../actions/userActions'
import { deleteCart } from '../actions/cartActions'
import axios from 'axios'

const PlaceOrderScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [couponName, setCouponName] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [message, setMessage] = useState(null)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponAppliedMessage, setCouponAppliedMessage] = useState(null)
  const [couponAmount, setCouponAmount] = useState(0)

  const userId = useSelector((state) => state.userLogin.userInfo._id)

  const cart = useSelector((state) => state.cart)

  const wallet = useSelector((state) => state.wallet)
  const { data } = wallet

  if (!cart.shippingAddress.address) {
    navigate('/shipping')
  } else if (!cart.paymentMethod) {
    navigate('/payment')
  }

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  let walletUsed = 0
  if (Number(cart.itemsPrice) + Number(cart.shippingPrice) - data > 0) {
    walletUsed = data
  } else {
    walletUsed = Number(cart.itemsPrice) + Number(cart.shippingPrice)
  }
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce(
      (acc, item) =>
        acc +
        (item.product.discountPrice
          ? item.product.price -
            item.product.discountPrice * 0.01 * item.product.price
          : item.product.price) *
          item.qty,
      0
    )
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 500 ? 0 : 40)
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) -
    Number(walletUsed) -
    Number(couponAmount)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const applyCouponHandler = async (couponId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const couponDataRaw = await axios.put(
      '/api/coupon',
      { couponId, user: userId },
      config
    )
    if (couponDataRaw.data.error) {
      setMessage(couponDataRaw.data.error)
    } else {
      setCouponApplied(true)
      setCouponAppliedMessage(`${couponDataRaw.data.discount} discount applied`)
      setCouponAmount(couponDataRaw.data.discount)
    }
  }

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    dispatch(showWalletBalance())
  }, [navigate, success])

  useEffect(() => {
    //to get the list of all available coupons
    setMessage(null)
    const getAllCoupons = async () => {
      const { data } = await axios.get(`/api/coupon`)
      setCoupons(data)
    }
    getAllCoupons()
  }, [order])

  const placeOrderHandler = () => {
    dispatch(deleteCart())
    dispatch(deductFromWallet(walletUsed))
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        walletDiscount: walletUsed,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x &#x20b9;
                          {item.product.discountPrice
                            ? item.product.price -
                              item.product.discountPrice *
                                0.01 *
                                item.product.price
                            : item.product.price}
                          = &#x20b9;
                          {item.qty *
                            (item.product.discountPrice
                              ? item.product.price -
                                item.product.discountPrice *
                                  0.01 *
                                  item.product.price
                              : item.product.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#x20b9;{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#x20b9;{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Wallet Balance Used</Col>
                  <Col>&#x20b9;{walletUsed}</Col>
                </Row>
              </ListGroup.Item>
              {couponAmount > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Coupon Offer</Col>
                    <Col>&#x20b9;{couponAmount}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Amount Payable</Col>
                  <Col>&#x20b9;{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  variant="success"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <Card>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Available Coupons</h2>
                </ListGroup.Item>
                {message && <Message variant="danger">{message}</Message>}
                {couponApplied ? (
                  <h1>
                    {couponAppliedMessage && (
                      <Message variant="success">
                        &#x20b9;{couponAppliedMessage}
                      </Message>
                    )}
                  </h1>
                ) : (
                  coupons.length > 0 &&
                  coupons.map((coupon) => {
                    return (
                      <ListGroup.Item>
                        <Row style={{ alignItems: 'baseline' }}>
                          <Col>
                            <strong>{coupon.name}</strong>
                          </Col>
                          <Col>
                            <p>&#x20b9;{coupon.discount} Off</p>
                          </Col>
                          <Col>
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                applyCouponHandler(coupon._id)
                              }}
                            >
                              Apply
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  })
                )}
                {}
              </ListGroup>
            </Col>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
