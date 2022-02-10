import axios from 'axios'
import {
  OFFERLIST_REQUEST,
  OFFERLIST_SUCCESS,
  OFFERLIST_FAILURE,
  DELETE_OFFER,
  UPDATE_OFFER,
  CREATE_OFFER,
} from '../constants/offerConstants'

export const listOffers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: OFFERLIST_REQUEST,
    })

    const { data } = await axios.get(`/api/offer`)

    dispatch({
      type: OFFERLIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    dispatch({
      type: OFFERLIST_FAILURE,
      payload: message,
    })
  }
}

export const deleteFromOffers = (id) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  await axios.delete(`/api/offer/${id}`, config)

  dispatch({
    type: DELETE_OFFER,
  })
}

export const updateOffer = (data) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  await axios.put(`/api/offer/${data.id}`, data, config)

  dispatch({
    type: UPDATE_OFFER,
  })
}

export const createOffer = (data) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  await axios.post(`/api/offer`, data, config)

  dispatch({
    type: CREATE_OFFER,
  })
}
