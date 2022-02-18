import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, FormControl, ListGroup } from 'react-bootstrap'
import { Table, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useParams } from 'react-router-dom'
import { listCategories } from '../actions/categoryActions'
import { createOffer } from '../actions/offerActions'

const CreateOfferScreen = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [discount, setDiscount] = useState(0)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const dispatch = useDispatch()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await axios.post('/api/coupon', {
      name,
      discount,
      description,
    })
    setLoading(false)
    navigate('/admin/offers')
  }

  useEffect(() => {
    dispatch(listCategories())
  }, [])

  return (
    <>
      <Link to="/admin/offers" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Add a new Coupon</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="py-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the coupon code"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="py-3" controlId="discount">
              <Form.Label>Discount amount in rupees</Form.Label>
              <Form.Control
                type="Number"
                placeholder="Enter the discount amount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="py-3" controlId="description">
              <Form.Label>Write a description</Form.Label>
              <Form.Control
                type="String"
                placeholder="Add a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="info">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default CreateOfferScreen
