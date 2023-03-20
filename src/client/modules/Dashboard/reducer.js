import { DATA_HUB_FEED__FETCHED } from '../../actions'

const initialState = {
  dataHubFeed: [],
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case DATA_HUB_FEED__FETCHED:
      const { dataHubFeed } = result
      return {
        ...state,
        dataHubFeed,
      }
    default:
      return state
  }
}
