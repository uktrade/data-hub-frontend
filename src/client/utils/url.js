import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const getQueryParamsFromLocation = (location) => {
  const queryString = location.search.slice(1)
  return omitBy({ ...qs.parse(queryString) }, isEmpty)
}
