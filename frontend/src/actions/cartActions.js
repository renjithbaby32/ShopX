import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  SHOW_CART_ITEM,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`)

  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  const cart = {
    user: userInfo._id,
    product: data._id,
    qty: qty,
    name: data.name,
    price: data.price,
    image: data.image,
    countInStock: data.countInStock,
  }

  const response = await axios.post('/api/cart', cart, config)
  dispatch({
    type: CART_ADD_ITEM,
    payload: response.data,
  })
}

export const removeFromCart = (id) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  const { data } = await axios.delete(
    `/api/cart/${userInfo._id}?productId=${id}`,
    config
  )

  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })
}

export const deleteCart = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  await axios.delete(`/api/cart/checkout/${userInfo._id}`, config)
}

export const listCartItems = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  const { data } = await axios.get(`/api/cart/${userInfo._id}`, config)

  dispatch({
    type: SHOW_CART_ITEM,
    payload: data,
  })
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
