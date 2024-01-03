import { OVERVIEW__EXPORT_WINS_SUMMARY } from '../../../../../client/actions'

const initialState = {
  results: [],
  selectedAdvisers: [],
  metadata: {},
  isComplete: false,
}

export default (state = { initialState }, { type, result: data }) => {
  if (type === OVERVIEW__EXPORT_WINS_SUMMARY) {
    return {
      ...state,
      count: data.count,
      latestExportWin: data.result,
    }
  }

  return state
}
