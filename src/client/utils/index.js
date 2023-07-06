import { isEmpty, omitBy } from 'lodash'
import qs from 'qs'

export const idNameToValueLabel = ({ id, name }) => ({
  value: id,
  label: name,
})

export const idNamesToValueLabels = (idNames) => idNames.map(idNameToValueLabel)

export const parseQueryString = (queryString) => {
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}
