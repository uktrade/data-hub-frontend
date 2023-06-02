import { DNB_FAMILY_TREE_LOADED } from '../../../../client/actions'

const initialState = { familyTree: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case DNB_FAMILY_TREE_LOADED:
      return {
        ...state,
        familyTree: result,
      }
    default:
      return state
  }
}
