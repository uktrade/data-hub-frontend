import { DATA_SUMMARY__ACCESSIBLE_TOGGLE } from '../../actions'

export default (state = { accessible: false }, { type }) => {
  switch (type) {
    case DATA_SUMMARY__ACCESSIBLE_TOGGLE:
      return {
        ...state,
        accessible: !state.accessible,
      }
    default:
      return state
  }
}
