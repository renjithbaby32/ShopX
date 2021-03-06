import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_RESET,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  WISHLIST_LIST_REQUEST,
  WISHLIST_LIST_SUCCESS,
  WISHLIST_LIST_FAIL,
  ADD_T0_WISHLIST_REQUEST,
  ADD_T0_WISHLIST_SUCCESS,
  ADD_T0_WISHLIST_FAIL,
  DELETE_FROM_WISHLIST_REQUEST,
  DELETE_FROM_WISHLIST_SUCCESS,
  DELETE_FROM_WISHLIST_FAIL,
  SHOW_REFERRAL_CODE,
  SHOW_WALLET_BALANCE,
  DEDUCT_FROM_WALLET,
  LOAD_ADDRESSES,
  ADD_ADDRESS,
} from '../constants/userConstants'

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true }
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true }
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER_DETAILS_RESET:
      return { user: {} }
    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload }
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true }
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload }
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload }
    case USER_LIST_RESET:
      return { users: [] }
    default:
      return state
  }
}

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true }
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true }
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userUpdateReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true }
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true }
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_RESET:
      return {
        user: {},
      }
    default:
      return state
  }
}

export const wishListReducer = (state = { wishlistItems: [] }, action) => {
  switch (action.type) {
    case WISHLIST_LIST_REQUEST:
      return { loading: true }
    case WISHLIST_LIST_SUCCESS:
      return { loading: false, wishlistItems: action.payload }
    case WISHLIST_LIST_FAIL:
      return { loading: false, error: action.payload }
    case ADD_T0_WISHLIST_REQUEST:
      return { loading: true }
    case ADD_T0_WISHLIST_SUCCESS:
      return { loading: false, success: true }
    case ADD_T0_WISHLIST_FAIL:
      return { loading: false, error: action.payload }
    case DELETE_FROM_WISHLIST_REQUEST:
      return { loading: true }
    case DELETE_FROM_WISHLIST_SUCCESS:
      return { loading: false, successDelete: true }
    case DELETE_FROM_WISHLIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const referralIdReducer = (state = { id: [] }, action) => {
  switch (action.type) {
    case SHOW_REFERRAL_CODE:
      return { id: action.payload }
    default:
      return state
  }
}

export const walletIdReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case SHOW_WALLET_BALANCE:
      return { data: action.payload }
    case DEDUCT_FROM_WALLET:
      return state
    default:
      return state
  }
}

export const addressListReducer = (state = { addresses: [] }, action) => {
  switch (action.type) {
    case LOAD_ADDRESSES:
      return { ...state, addresses: action.payload }
    case ADD_ADDRESS:
      return { ...state, addedAddress: true }
    case 'DELETE_ADDRESS':
      return { ...state, deletedAddress: true }
    case 'RESET_ADDRESS_STATUS':
      return {
        ...state,
        deletedAddress: false,
        addedAddress: false,
        updatedAddress: false,
      }
    case 'ADDRESS_UPDATED':
      return { ...state, updatedAddress: true }

    default:
      return state
  }
}
