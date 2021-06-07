import axios from 'axios'

import { transformResponseToCollection } from './transformers'
import urls from '../../../lib/urls'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getContacts = ({
  limit = 10,
  page = 1,
  name,
  company_name,
  company_sector_descends,
  address_country,
  company_uk_region,
}) =>
  axios
    .post('/api-proxy/v3/search/contact', {
      limit,
      offset: limit * (page - 1),
      name,
      company_name,
      company_sector_descends,
      address_country,
      company_uk_region,
      sortby: 'modified_on:desc',
      archived: false,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

const getMetadataSectionOptions = (url) =>
  axios
    .get(url)
    .then(({ data }) =>
      data
        .filter(({ level }) => level === 0)
        .map(({ id, name }) => ({ value: id, label: name }))
    )

const getMetadataOptions = (url) =>
  axios
    .get(url)
    .then(({ data }) =>
      data.map(({ id, name }) => ({ value: id, label: name }))
    )

export const getContactsMetadata = () =>
  Promise.all([
    getMetadataSectionOptions(urls.metadata.sector()),
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion()),
  ])
    .then(([sectorOptions, countryOptions, ukRegionOptions]) => ({
      sectorOptions,
      countryOptions,
      ukRegionOptions,
    }))
    .catch(handleError)
