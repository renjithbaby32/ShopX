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
import {
  listProducts,
  getProductsByCategory,
  listTopProducts,
} from '../actions/productActions'
import { listWishlist } from '../actions/userActions'
import { listOffers } from '../actions/offerActions'
import OfferCarousel from '../components/OfferCarousel'

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

  const offerList = useSelector((state) => state.offerList)
  const { loading: listLoadng, error: listError, offers } = offerList

  const productTopRated = useSelector((state) => state.productTopRated)
  const {
    loading: topRatedProductsLoading,
    error: topRatedProductsError,
    products: topRatedProducts,
  } = productTopRated

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
      dispatch(listOffers())
      dispatch(listTopProducts())
    }
    if (userInfo) {
      dispatch(listWishlist())
    }
  }, [dispatch, keyword, pageNumber, id])

  return (
    <>
      <Meta title="Home | ShopX" />
      {!keyword && !id && (
        <>{offers.length === 0 ? <ProductCarousel /> : <OfferCarousel />}</>
      )}

      <>
        {!keyword && !id && (
          <>
            <h1>Top Rated Products</h1>
            <Row>
              {topRatedProductsLoading ? (
                <Loader />
              ) : topRatedProductsError ? (
                <Message variant="danger">{error}</Message>
              ) : (
                topRatedProducts.map((product) => (
                  <Col key={product._id} sm={6} md={4} lg={3} xl={2}>
                    <Product wishlist={wishlistItems} product={product} />
                  </Col>
                ))
              )}
            </Row>
          </>
        )}
        <h1>
          {id
            ? 'Category: ' + id
            : keyword
            ? `Products related to '` + keyword + `'`
            : 'Latest Products'}
        </h1>
        <Row>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            products.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={3} xl={2}>
                <Product wishlist={wishlistItems} product={product} />
              </Col>
            ))
          )}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </>
    </>
  )
}

export default HomeScreen
