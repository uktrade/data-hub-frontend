import axios from 'axios'
import { transformResponseToCompanyCollection } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

function getCompanies({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post('/api-proxy/v4/search/company', {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data), handleError)
}

/**
 * Get metadata options as a list of values and labels
 */
function getMetadataOptions(url) {
  return axios
    .get(url)
    .then(({ data }) =>
      data.map(({ id, name }) => ({ value: id, label: name }))
    )
}

/**
 * Get the hq type options as a list of values and labels
 */
function getHeadquarterTypeOptions(url) {
  const hqTypes = {
    ukhq: 'UK HQ',
    ghq: 'Global HQ',
    ehq: 'European HQ',
  }
  return getMetadataOptions(url).then((items) =>
    items
      .map(({ value, label }) => ({
        value,
        label: hqTypes[label] || label,
      }))
      .sort((item1, item2) => item1.label > item2.label)
  )
}

/**
 * Get the options for each of the given metadata urls.
 *
 * Waits until all urls have been fetched before generating a result.
 *
 * @param {object} metadataUrls - a lookup of category names to the api url
 *
 * @returns {promise} - the promise containing a list of options for each category
 */
function getCompaniesMetadata(metadataUrls) {
  const optionCategories = Object.keys(metadataUrls)
  return Promise.all(
    optionCategories.map((name) =>
      name == 'headquarterTypeOptions'
        ? getHeadquarterTypeOptions(metadataUrls[name])
        : getMetadataOptions(metadataUrls[name])
    ),
    handleError
  ).then((results) =>
    Object.fromEntries(
      results.map((options, index) => [optionCategories[index], options])
    )
  )
}

export { getCompanies, getCompaniesMetadata }
