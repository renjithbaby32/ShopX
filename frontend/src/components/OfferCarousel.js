import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listOffers } from '../actions/offerActions'

const OfferCarousel = () => {
  const dispatch = useDispatch()

  const offerList = useSelector((state) => state.offerList)
  const { loading, error, offers } = offerList

  useEffect(() => {
    dispatch(listOffers())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel
      indicators={false}
      controls={false}
      pause="hover"
      variant="dark"
      style={
        {
          // backgroundColor: 'rgb(187 193 237 / 40%)',
          // marginBottom: '50px',
        }
      }
    >
      {offers.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/category/${product.category}`}>
            <Image
              roundedCircle={false}
              src={
                product.category === 'laptop'
                  ? // ? 'https://assetscdn1.paytm.com/images/catalog/view_item/684730/1617042234651.png?imwidth=1600&impolicy=hq'
                    'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Desktops/Lenovo/Feb/1242x450_lenovo_desk.jpg'
                  : product.category === 'smartphone'
                  ? // ? 'https://www.gizbot.com/img/600x90/img/2020/05/amazon-special-offers-on-best-smartphones-after-lock-down-period-1589946628.jpg'
                    'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Wireless/WLA/Feb22/AccPage/Attach/D38687335_WLA_Attach_banners_Acc_Mob_Hero_1242x450_2.jpg'
                  : 'https://cloudfour.com/examples/img-currentsrc/images/kitten-large.png'
              }
              alt=""
              fluid
            />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.title} Offer,&nbsp;
                {product.category === 'others' ? 'Accessory' : product.category}
                &nbsp;Products at {product.discountPercentage}% Discount &nbsp;
                {!product.active && '(Coming soon)'}
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default OfferCarousel
