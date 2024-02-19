import { ORDERS__QUOTE_PREVIEW_LOADED } from '../../actions'

export default (state = {}, { type, result }) => {
  switch (type) {
    case ORDERS__QUOTE_PREVIEW_LOADED:
      return {
        ...state,
        quotePreview: result,
      }
    default:
      return state
  }
}
