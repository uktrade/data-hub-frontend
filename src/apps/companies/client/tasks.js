import axios from 'axios'

import urls from '../../../lib/urls'
import {
  getHeadquarterTypeOptions,
  getMetadataOptions,
  getSectorOptions,
} from '../../../client/metadata'

import { transformResponseToCompanyCollection } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getCompanies = ({ limit = 10, page, archived, ...rest }) => {
  const offset = limit * (parseInt(page, 10) - 1) || 0
  let options = { limit, offset, ...rest }

  // The archived param only needs to be present when a single option is picked
  if (archived && archived.length === 1) {
    options.archived = archived[0] === 'true'
  }

  return axios
    .post('/api-proxy/v4/search/company', options)
    .then(({ data }) => transformResponseToCompanyCollection(data))
    .catch(handleError)
}

/**
 * Get the options for each of the metadata urls.
 *
 * Waits until all urls have been fetched before generating a result.
 *
 * @returns {promise} - the promise containing a list of options for each category
 */
const getCompaniesMetadata = () => {
  return Promise.all([
    getSectorOptions(urls.metadata.sector()),
    getHeadquarterTypeOptions(urls.metadata.headquarterType()),
    getMetadataOptions(urls.metadata.ukRegion()),
    getMetadataOptions(urls.metadata.country()),
  ])
    .then(
      ([
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        countryOptions,
      ]) => ({
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        countryOptions,
      })
    )
    .catch(handleError)
}

export { getCompanies, getCompaniesMetadata }
