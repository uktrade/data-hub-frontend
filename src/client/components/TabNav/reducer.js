import { TAB_NAV__SELECT } from '../../actions'

export default (state = {}, { type, ...action }) =>
  type === TAB_NAV__SELECT ? action : state
