import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { deleteFromOffers, listOffers } from '../actions/offerActions'
import { LinkContainer } from 'react-router-bootstrap'

const OfferlistScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const offerList = useSelector((state) => state.offerList)
  const { loading, error, offers } = offerList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const deleteHandler = (offerId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteFromOffers(offerId))
    }
    navigate('/admin/offers')
  }

  const createOfferHandler = () => {
    navigate('/admin/offers/create')
  }

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listOffers())
    }
  }, [dispatch, userInfo])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Offers</h1>
        </Col>
        <Col className="text-right">
          <Button
            onClick={createOfferHandler}
            className="my-3"
            variant="success"
          >
            <i className="fas fa-plus"></i> Create An Offer
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Discount Percentage</th>
                <th>Active</th>
                <th>Categories</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td>{offer._id}</td>
                  <td>{offer.title}</td>
                  <td>{offer.discountPercentage}</td>
                  <td>{offer.active ? 'Yes' : 'No'}</td>
                  <td>{offer.category}</td>
                  <td>
                    <LinkContainer to={`/admin/offers/${offer._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(offer._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  )
}

export default OfferlistScreen
