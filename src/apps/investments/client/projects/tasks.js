import axios from 'axios'

import { getMetadataOptions } from '../../../../client/metadata'

import transformInvestmentProjectToListItem from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

function getProjects({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post('/api-proxy/v3/search/investment_project', {
      limit,
      offset,
      ...rest,
    })
    .then(
      ({ data }) => ({
        count: data.count,
        results: data.results.map(transformInvestmentProjectToListItem),
      }),
      handleError
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
function getMetadata(metadataUrls) {
  const optionCategories = Object.keys(metadataUrls)
  return Promise.all(
    optionCategories.map((name) =>
      name == 'sectorOptions'
        ? getMetadataOptions(metadataUrls[name], {
            params: {
              level__lte: '0',
            },
          })
        : getMetadataOptions(metadataUrls[name])
    ),
    handleError
  ).then((results) =>
    Object.fromEntries(
      results.map((options, index) => [optionCategories[index], options])
    )
  )
}

export { getProjects, getMetadata }
