import axios from 'axios'

import { getMetadataOptions } from '../../../../../client/metadata'
import { transformCompanyToListItem } from '../transformers'
import urls from '../../../../../lib/urls'

import { CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID } from './state'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export function openContactForm({ values, url }) {
  window.sessionStorage.setItem(
    CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID,
    JSON.stringify(values)
  )
  window.location.href = url
}

export const createInvestmentProject = (formValues) =>
  axios.post('/api-proxy/v3/investment', formValues).catch(handleError)

const orderInvestmentTypes = ([first, ...rest]) => [...rest, first]

export const getCompanyInvestmentsCount = (companyId) =>
  axios
    .post('/api-proxy/v3/search/investment_project', {
      limit: 1,
      offset: 0,
      investor_company: [companyId],
    })
    .then(({ data }) => ({
      count: data.count,
    }))
    .catch(handleError)

const getAdvisers = () =>
  axios
    .get('/api-proxy/adviser/', {
      params: {
        is_active: true,
      },
    })
    .then(({ data: { results } }) =>
      results
        .filter((adviser) => adviser?.name.trim().length)
        .map(({ id, name }) => ({
          label: name,
          value: id,
        }))
    )

export const searchCompany = ({ searchTerm }) =>
  axios
    .post('/api-proxy/v4/search/company', {
      limit: 10,
      offset: 0,
      archived: false,
      uk_based: false,
      name: searchTerm,
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results.map(transformCompanyToListItem),
    }))
    .catch(handleError)

const getAdviser = () =>
  axios
    .get('/api-proxy/whoami/')
    .then(({ data }) => data)
    .catch(handleError)

export const getInitialFormValues = ({ fetchFromStorage, contact, company }) =>
  fetchFromStorage
    ? fetchValuesFromSessionStorage(contact)
    : fetchValuesFromAPI(company)

const fetchValuesFromSessionStorage = (contact) => {
  const item = window.sessionStorage.getItem(
    CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID
  )
  const values = JSON.parse(item)
  const contacts = values.contacts ? values.contacts : []
  return {
    ...values,
    contacts: [...contacts, contact],
  }
}

const fetchValuesFromAPI = () => {
  const promises = [
    getAdviser(),
    getAdvisers(),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(urls.metadata.fdiType()),
    getMetadataOptions(urls.metadata.investmentType()),
    getMetadataOptions(urls.metadata.referralSourceActivity()),
    getMetadataOptions(urls.metadata.referralSourceMarketing()),
    getMetadataOptions(urls.metadata.referralSourceWebsite()),
    getMetadataOptions(urls.metadata.investmentInvestorType()),
    getMetadataOptions(urls.metadata.investmentInvolvement()),
    getMetadataOptions(urls.metadata.investmentSpecificProgramme()),
    getMetadataOptions(urls.metadata.investmentBusinessActivity()),
  ]

  return Promise.all(promises)
    .then(
      ([
        adviser,
        advisers,
        sectors,
        fdiTypes,
        investmentTypes,
        referralSourceActivity,
        referralSourceMarketing,
        referralSourceWebsite,
        investmentInvestorType,
        investmentInvolvement,
        investmentSpecificProgramme,
        investmentBusinessActivity,
      ]) => ({
        adviser,
        advisers,
        sectors,
        fdiTypes,
        investmentTypes: orderInvestmentTypes(investmentTypes),
        referralSourceActivity,
        referralSourceMarketing,
        referralSourceWebsite,
        investmentInvestorType,
        investmentInvolvement,
        investmentSpecificProgramme,
        investmentBusinessActivity,
      })
    )
    .catch(handleError)
}
