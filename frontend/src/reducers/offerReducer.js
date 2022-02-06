import {
  DELETE_OFFER,
  OFFERLIST_FAILURE,
  OFFERLIST_REQUEST,
  OFFERLIST_SUCCESS,
  UPDATE_OFFER,
  CREATE_OFFER,
} from '../constants/offerConstants'

export const offerListReducer = (state = { offers: [] }, action) => {
  switch (action.type) {
    case OFFERLIST_REQUEST:
      return { ...state, loading: true }
    case OFFERLIST_SUCCESS:
      return { loading: false, offers: action.payload }
    case OFFERLIST_FAILURE:
      return { loading: false, error: action.payload }
    case UPDATE_OFFER:
      return { ...state, updateSuccess: true }
    case CREATE_OFFER:
      return { ...state, createSuccess: true }

    case DELETE_OFFER:
      return { ...state }

    default:
      return state
  }
}
