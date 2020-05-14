import { INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE } from '../../../../../client/actions'

export default (state = {}, { type }) =>
  type === INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE
    ? { ...state, stageUpdated: true }
    : state
