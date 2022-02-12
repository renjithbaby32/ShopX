import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Card, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import {
  addToAddresses,
  deleteAddress,
  listAddresses,
} from '../actions/userActions'
import axios from 'axios'

const AddressEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const addressList = useSelector((state) => state.addressList)
  const { addresses, addedAddress, deletedAddress, updatedAddress } =
    addressList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()

  const [address, setAddress] = useState()
  const [city, setCity] = useState()
  const [postalCode, setPostalCode] = useState()
  const [country, setCountry] = useState()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    const getAddress = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.get(`/api/address/ind/${id}`, config)
      setAddress(data.address)
      setCity(data.city)
      setPostalCode(data.postalCode)
      setCountry(data.country)
    }

    getAddress()
  }, [dispatch])

  const addressUpdateHandler = async (e) => {
    e.preventDefault()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    await axios.put(
      `/api/address/ind/${id}`,
      { address, city, postalCode, country },
      config
    )

    dispatch({ type: 'ADDRESS_UPDATED' })
    navigate('/addressmanage')
  }

  return (
    <>
      <FormContainer>
        <h2>Update the Address</h2>
        <Form onSubmit={addressUpdateHandler} className="py-3">
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
            Update Address
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default AddressEditScreen
