import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, ListGroup } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { useParams } from 'react-router-dom'
import { listCategories } from '../actions/categoryActions'
import { updateOffer } from '../actions/offerActions'

const OfferEditScreen = () => {
  const { id } = useParams()
  const offerId = id
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [active, setActive] = useState(false)
  const [category, setCategory] = useState('all')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const offerList = useSelector((state) => state.offerList)
  const { loading, error, offers } = offerList

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(listCategories())
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }

        const { data } = await axios.get(`/api/offer/${offerId}`, config)
        setTitle(data.title)
        setDiscountPercentage(data.discountPercentage)
        setActive(data.active)
        setCategory(data.category)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateOffer({
        id: offerId,
        title,
        discountPercentage,
        active,
        category,
      })
    )
    navigate('/admin/offers')
  }

  return (
    <>
      <Link to="/admin/offers" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Offer</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="py-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the title for the offer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="py-3" controlId="discountPercentage">
              <Form.Label>Discount percentage</Form.Label>
              <Form.Control
                type="Number"
                placeholder="Enter the discount percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <ListGroup.Item className="py-3 mb-3">
              <Row>
                <Col>Status</Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                  >
                    <option key={1} value={true}>
                      Active
                    </option>
                    <option key={2} value={false}>
                      Inactive
                    </option>
                    ))
                  </Form.Control>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="py-3 mb-3">
              <Row>
                <Col>Category</Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((x) => (
                      <option key={x._id} value={x.name}>
                        {x.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </ListGroup.Item>

            <Button type="submit" variant="info">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default OfferEditScreen
