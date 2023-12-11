import { isEmpty, omitBy, isPlainObject, camelCase } from 'lodash'
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

export const deepKeysToCamelCase = (x) =>
  Array.isArray(x)
    ? x.map(deepKeysToCamelCase)
    : isPlainObject(x)
      ? Object.fromEntries(
          Object.entries(x).map(([k, v]) => [
            camelCase(k),
            deepKeysToCamelCase(v),
          ])
        )
      : x
