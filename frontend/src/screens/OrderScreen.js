import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  dispatchOrder,
  outForDeliveryOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DISPATCH_RESET,
  ORDER_OUT_FOR_DELIVERY_RESET,
  ORDER_PAY_SUCCESS,
} from '../constants/orderConstants'

const OrderScreen = () => {
  const params = useParams()
  const orderId = params.id

  const navigate = useNavigate()

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const orderDispatch = useSelector((state) => state.orderDispatch)
  const { loading: loadingDispatch, success: successDispatch } = orderDispatch

  const orderOutForDelivery = useSelector((state) => state.orderOutForDelivery)
  const { loading: loadingOutForDelivery, success: successOutForDelivery } =
    orderOutForDelivery

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    // order.itemsPrice = addDecimals(
    //   order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    // )
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  async function showRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const { data } = await axios.post(`/razorpay/${orderId}`)

    const options = {
      key: 'rzp_test_w4t1UiRN2QYw07',
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: 'ShopX',
      description: 'Make the payment to complete the process',
      image: '',
      handler: async (response) => {
        await axios.post(`/razorpay/success/${orderId}`)
        dispatch({ type: ORDER_PAY_SUCCESS })
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);

        alert('Transaction successful')
      },
      prefill: {
        name: 'Renjith Baby',
        email: 'renjithbabyofficial@gmail.com',
        phone_number: '9495064118',
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    // dispatch({
    //   type: 'ORDER_DELIVER_SUCCESS',
    // })
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    if (
      !order ||
      successPay ||
      successDeliver ||
      successDispatch ||
      successOutForDelivery ||
      order._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch({ type: ORDER_DISPATCH_RESET })
      dispatch({ type: ORDER_OUT_FOR_DELIVERY_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
      } else {
        setSdkReady(true)
      }
    }
  }, [
    dispatch,
    orderId,
    successPay,
    successDeliver,
    successDispatch,
    successOutForDelivery,
    order,
  ])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  const dispatchHandler = () => {
    dispatch(dispatchOrder(order))
  }

  const outForDeliveryHandler = () => {
    dispatch(outForDeliveryOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h3>Order {order._id}</h3>
      <h2>
        Status
        {order.isDelivered ? (
          <h2 className="text-success">Delivered</h2>
        ) : order.isOutForDelivery ? (
          <h2 className="text-info">
            Out for delivery<span> - Expect delivery today</span>
          </h2>
        ) : order.isDispatched ? (
          <>
            <h2 className="text-info">
              Dispatched<span> - Expect delivery in 2-4 days</span>
            </h2>
          </>
        ) : (
          <h2>Waiting for dispatch</h2>
        )}
      </h2>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                          {item.qty} x &#x20b9;{item.price} = &#x20b9;
                          {item.qty * item.price}
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
                  <Col>&#x20b9;{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#x20b9;{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Wallet Discount</Col>
                  <Col>
                    &#x20b9;{order.walletDiscount ? order.walletDiscount : 0}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#x20b9;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  <Button className="btn btn-block" onClick={showRazorpay}>
                    Pay Now
                  </Button>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
              userInfo.isAdmin &&
              order.isDelivered ? null : userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                order.isOutForDelivery ? (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              ) : userInfo && userInfo.isAdmin && order.isDispatched ? (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={outForDeliveryHandler}
                  >
                    Mark As Out For Delivery
                  </Button>
                </ListGroup.Item>
              ) : userInfo && userInfo.isAdmin ? (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={dispatchHandler}
                  >
                    Mark As Dispatched
                  </Button>
                </ListGroup.Item>
              ) : null}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
