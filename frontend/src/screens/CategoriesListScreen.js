import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listCategories } from '../actions/categoryActions'
import { getProductsByCategory } from '../actions/productActions'

const CategoriesListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categoryList = useSelector((state) => state.categoryList)
  const { loading, error, categories } = categoryList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const createCategoryHandler = () => {
    if (userInfo && userInfo.isAdmin) {
      navigate('/admin/addcategory')
    } else {
      navigate('/login?redirect=addcategory')
    }
  }
  const deleteHandler = (id) => {}

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listCategories())
    }
  }, [dispatch, userInfo])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="text-right">
          <Button
            className="my-3"
            variant="success"
            onClick={createCategoryHandler}
          >
            <i className="fas fa-plus"></i> Create A Category
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
                <th>NAME</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>
                    <LinkContainer
                      to={`/admin/productsbycategory/${category.name}`}
                    >
                      <Button variant="light" className="btn-sm">
                        View Products
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    {/* <LinkContainer to={`/admin/category/${category._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(category._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button> */}
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
export default CategoriesListScreen
