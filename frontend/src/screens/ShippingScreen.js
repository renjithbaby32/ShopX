import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import { addToAddresses, listAddresses } from '../actions/userActions'

const ShippingScreen = () => {
  const navigate = useNavigate()

  const addressList = useSelector((state) => state.addressList)
  const { addresses } = addressList
  const dispatch = useDispatch()

  const [address, setAddress] = useState()
  const [city, setCity] = useState()
  const [postalCode, setPostalCode] = useState()
  const [country, setCountry] = useState()
  const [addressSelected, setAddressSelected] = useState()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    dispatch(addToAddresses({ address, city, postalCode, country }))
    navigate('/payment')
  }

  const addressSelector = (data) => {
    setAddressSelected(data)
    if (addressSelected) {
      dispatch(saveShippingAddress(addressSelected))
      navigate('/payment')
    }
  }

  useEffect(() => {
    dispatch(listAddresses())
  }, [])

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Row>
        {addresses.map((address) => (
          <Col key={address._id} sm={12} md={6} lg={4} xl={3}>
            <Card
              onClick={(e) => {
                e.preventDefault()
                addressSelector({
                  address: address.address,
                  city: address.city,
                  postalCode: address.postalCode,
                  country: address.country,
                })
              }}
              className="my-1 p-3 rounded mb-3"
            >
              <Card.Body>
                <Card.Text as="div">{address.address}</Card.Text>
                <Card.Text as="div">{address.city}</Card.Text>
                <Card.Text as="div">{address.postalCode}</Card.Text>
                <Card.Text as="div">{address.country}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Form onSubmit={submitHandler} className="py-3">
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="pb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="success">
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
