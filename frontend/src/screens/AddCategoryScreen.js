import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, FormControl } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useParams } from 'react-router-dom'

const AddCategoryScreen = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {}, [dispatch])

  const submitHandler = async (e) => {
    e.preventDefault()
    const { data } = await axios.post('/api/categories', { name })
    navigate('/admin/categories')
  }

  return (
    <>
      <Link to="/admin/categories" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Add a new Category</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="py-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="info">
            Create Category
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default AddCategoryScreen
