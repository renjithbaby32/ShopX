import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailValidationError, setEmailValidationError] = useState(null)
  const [passwordValidationError, setPasswordValidationError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || ''

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      navigate(`/${redirect}`)
    }
  }, [userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="py-1">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              if (e.target.value.length == 0) {
                setEmailValidationError('Email is required')
              } else {
                setEmailValidationError(null)
              }
              setEmail(e.target.value)
            }}
          ></Form.Control>
          {emailValidationError && (
            <p className="py-3 text-danger">{emailValidationError}</p>
          )}
        </Form.Group>

        <Form.Group controlId="password" className="py-1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              if (e.target.value.length == 0) {
                setPasswordValidationError('Password is required')
              }
              setPassword(e.target.value)
            }}
          ></Form.Control>
          {passwordValidationError && (
            <p className="py-3 text-danger">{passwordValidationError}</p>
          )}
        </Form.Group>
        <div className="py-3">
          <Button type="submit" variant="info">
            Sign In
          </Button>
        </div>
      </Form>

      <Row className="py-3">
        <Col>
          Forgot Password? <Link to={'/forgotPassword'}>Reset Password</Link>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
          New Customer? <Link to={'/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
