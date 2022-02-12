import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const AddressManageScreen = () => {
  const navigate = useNavigate()

  const addressList = useSelector((state) => state.addressList)
  const { addresses, addedAddress, deletedAddress } = addressList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()

  const [address, setAddress] = useState()
  const [city, setCity] = useState()
  const [postalCode, setPostalCode] = useState()
  const [country, setCountry] = useState()

  const addAddressHandler = (e) => {
    e.preventDefault()
    dispatch(addToAddresses({ address, city, postalCode, country }))
  }

  const deleteHandler = (addressId) => {
    dispatch(deleteAddress(addressId))
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    dispatch(listAddresses())
    dispatch({ type: 'RESET_ADDRESS_STATUS' })
  }, [dispatch, addedAddress, deletedAddress])

  return (
    <>
      <Link className="btn btn-light my-3" to="/profile">
        Go Back
      </Link>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Address</th>
            <th>City</th>
            <th>Postal Code</th>
            <th>Country</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address._id}>
              <td>{address._id}</td>
              <td>{address.address}</td>
              <td>{address.city}</td>
              <td>{address.postalCode}</td>
              <td>{address.country}</td>
              <td>
                <LinkContainer to={`/address/${address._id}/edit`}>
                  <Button variant="light" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteHandler(address._id)
                  }}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <FormContainer>
        <h2>Add An Address</h2>
        <Form onSubmit={addAddressHandler} className="py-3">
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
            Add Adress
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default AddressManageScreen
