import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'
import axios from 'axios'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [OTP, setOTP] = useState()
  const [OTPFromBackend, setOTPFromBackend] = useState()
  const [message, setMessage] = useState()

  const navigate = useNavigate()
  useEffect(() => {}, [navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    const OTP2 = OTPFromBackend.toString()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      if (OTP === OTP2) {
        await axios.put('/api/users/forgotPassword', { email, password })
        navigate('/login')
      }
    }
  }

  const getOTPHandler = async (e) => {
    e.preventDefault()
    const { data } = await axios.post('/api/users/forgotPassword', { email })
    setOTPFromBackend(data.otp)
  }

  return (
    <>
      <FormContainer className="py-3">
        <Form onSubmit={getOTPHandler}>
          <h2>OTP</h2>
          <Form.Group controlId="email" className="py-1">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <p className="pt-3">OTP will be sent to registered phone number</p>

          <div className="py-3">
            <Button type="submit" variant="info">
              Get OTP
            </Button>
          </div>
        </Form>
      </FormContainer>

      <FormContainer className="py-3">
        <h2>Enter OTP and create new Password</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="otp" className="py-1">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP received in phone"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="py-1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="py-1">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {message && <Message variant="danger">{message}</Message>}

          <div className="py-3">
            <Button type="submit" variant="info">
              Change Password
            </Button>
          </div>
        </Form>
      </FormContainer>
    </>
  )
}

export default RegisterScreen
