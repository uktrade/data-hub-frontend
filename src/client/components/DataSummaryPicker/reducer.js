import {
  DATA_SUMMARY_PICKER__RANGE_SELECTED,
  DATA_SUMMARY_PICKER__ACCESSIBLE_TOGGLE,
} from '../../actions'

export default (state = { accessible: false }, { type, result }) => {
  switch (type) {
    case DATA_SUMMARY_PICKER__RANGE_SELECTED:
      return {
        ...state,
        selectedRangeName: result,
      }
    case DATA_SUMMARY_PICKER__ACCESSIBLE_TOGGLE:
      return {
        ...state,
        accessible: !state.accessible,
      }
    default:
      return state
  }
}
