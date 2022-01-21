import {
    CATEGORY_LIST_FAIL,
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS
} from '../constants/categoryConstants'

export const categoryListReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
      case CATEGORY_LIST_REQUEST:
        return { loading: true, categories: [] }
      case CATEGORY_LIST_SUCCESS:
        return {
          loading: false,
          categories: action.payload.data,
        }
      case CATEGORY_LIST_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }