import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneValidationError, setPhoneValidationError] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordValidationError, setPasswordValidationError] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] =
    useState(null)
  const [message, setMessage] = useState(null)
  const [referralId, setReferralId] = useState()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password, referralId, phone))
    }
  }

  return (
    <FormContainer className="py-3">
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="py-1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="py-1">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="phone" className="py-1">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="py-1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (e.target.value.length < 6) {
                setPasswordValidationError(
                  'Password must be at least 6 characters'
                )
              } else {
                setPasswordValidationError(null)
              }
            }}
          ></Form.Control>
          {passwordValidationError && (
            <p className="py-1 text-danger">{passwordValidationError}</p>
          )}
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="py-1">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (e.target.value !== password) {
                setConfirmPasswordValidationError('Passwords do not match')
              } else {
                setConfirmPasswordValidationError(null)
              }
            }}
          ></Form.Control>
          {confirmPasswordValidationError && (
            <p className="py-1 text-danger">{confirmPasswordValidationError}</p>
          )}
        </Form.Group>

        <Form.Group controlId="referralId" className="py-1">
          <Form.Label>Have a referral Id?</Form.Label>
          <Form.Control
            type="String"
            placeholder="Enter referral Id"
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <div className="py-3">
          <Button type="submit" variant="info">
            Register
          </Button>
        </div>
      </Form>

      <Row>
        <Col>
          Have an Account? <Link to={'/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
