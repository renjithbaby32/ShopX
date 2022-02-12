import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getUserDetails,
  listAddresses,
  showReferralCode,
  showWalletBalance,
  updateUserProfile,
} from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const addressList = useSelector((state) => state.addressList)
  const { addresses, addedAddress, deletedAddress } = addressList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const referralId = useSelector((state) => state.referralId)
  const { id } = referralId

  const wallet = useSelector((state) => state.wallet)
  const { data } = wallet

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(showReferralCode())
        dispatch(showWalletBalance())
        dispatch(listMyOrders())
        dispatch(listAddresses())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, navigate, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  const addressManageHandler = (e) => {
    e.preventDefault()
    navigate('/addressmanage')
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {}
        {success && <Message variant="success">Profile Updated</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="pb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="success">
              Update
            </Button>
            <p className="my-3">
              Your wallet balance<br></br>
            </p>
            <p style={{ fontSize: '2rem', color: 'green' }}>
              &#x20b9;{data ? data : 0}
            </p>

            <p className="my-3">
              Your shareable referral code is <br></br>
            </p>
            {id.map((id) => (
              <p key={id._id} style={{ fontSize: '2rem', color: 'green' }}>
                {id.referralId}
              </p>
            ))}
            <p className="my-3">
              Share this code with your friends and you both get &#x20b9;500
              when your friend registers for a free account<br></br>
            </p>
          </Form>
        )}
        {addresses && (
          <>
            <h1>Addresses</h1>
            {addresses.map((address) => {
              return (
                <Card className="my-1 p-3 rounded mb-3">
                  <Card.Body>
                    <Card.Text as="div">{address.address}</Card.Text>
                    <Card.Text as="div">{address.city}</Card.Text>
                    <Card.Text as="div">{address.postalCode}</Card.Text>
                    <Card.Text as="div">{address.country}</Card.Text>
                  </Card.Body>
                </Card>
              )
            })}
            <Button
              onClick={addressManageHandler}
              className="primary btn-block"
            >
              Manage Addresses
            </Button>
          </>
        )}
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>ORDER ITEM</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.orderItems[0].name}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
