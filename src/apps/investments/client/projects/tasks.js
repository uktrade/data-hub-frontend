import { apiProxyAxios } from '../../../../client/components/Task/utils'

import { getMetadataOptions } from '../../../../client/metadata'
import { transformInvestmentProjectToListItem } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const getProjects = ({ limit = 10, page, companyId, ...rest }) => {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      offset,
      ...(companyId && {
        investor_company: [companyId],
      }),
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
export const getMetadata = (metadataUrls) => {
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
