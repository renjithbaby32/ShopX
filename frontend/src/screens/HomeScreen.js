import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts, getProductsByCategory } from '../actions/productActions'
import { listWishlist } from '../actions/userActions'

const HomeScreen = () => {
  const params = useParams()
  const keyword = params.keyword
  const id = params.id
  const pageNumber = params.pageNumber
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const wishlist = useSelector((state) => state.wishlist)
  const {
    loading: wishlistLoading,
    error: wishlistError,
    wishlistItems,
    successDelete,
  } = wishlist

  useEffect(() => {
    if (id === 'smartphone' || id === 'laptop' || id === 'others') {
      dispatch(getProductsByCategory(id))
    } else {
      dispatch(listProducts(keyword, pageNumber))
    }
    if (userInfo) {
      dispatch(listWishlist())
    }
  }, [dispatch, keyword, pageNumber, id])

  return (
    <>
      <Meta title="Home | ShopX" />
      {!keyword && !id && <ProductCarousel />}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={3} xl={2}>
                <Product wishlist={wishlistItems} product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
