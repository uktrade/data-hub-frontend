import { getMetadataOptions } from '../../../../../client/metadata'
import { transformCompanyToListItem } from '../transformers'
import urls from '../../../../../lib/urls'

import { CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID } from './state'
import { apiProxyAxios } from '../../../../../client/components/Task/utils'

const orderInvestmentTypes = ([first, ...rest]) => [...rest, first]

export const createInvestmentProject = (formValues) =>
  apiProxyAxios.post('/v3/investment', formValues)

export const getCompanyInvestmentsCount = (companyId) =>
  apiProxyAxios
    .post('/v3/search/investment_project', {
      limit: 1,
      offset: 0,
      investor_company: [companyId],
    })
    .then(({ data }) => ({
      count: data.count,
    }))

const getAdvisers = () =>
  apiProxyAxios
    .get('/adviser/', {
      params: {
        is_active: true,
        limit: 100000,
        offset: 0,
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
  apiProxyAxios
    .post('/v4/search/company', {
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

const getAdviser = () => apiProxyAxios.get('/whoami/').then(({ data }) => data)

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

const fetchValuesFromAPI = () =>
  Promise.all([
    getAdviser(),
    getAdvisers(),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(urls.metadata.investmentType()),
    getMetadataOptions(urls.metadata.referralSourceActivity()),
    getMetadataOptions(urls.metadata.referralSourceMarketing()),
    getMetadataOptions(urls.metadata.referralSourceWebsite()),
    getMetadataOptions(urls.metadata.investmentInvestorType()),
    getMetadataOptions(urls.metadata.investmentInvolvement()),
    getMetadataOptions(urls.metadata.investmentSpecificProgramme()),
    getMetadataOptions(urls.metadata.investmentBusinessActivity()),
    getMetadataOptions(urls.metadata.likelihoodToLand()),
  ]).then(
    ([
      adviser,
      advisers,
      sectors,
      investmentTypes,
      referralSourceActivity,
      referralSourceMarketing,
      referralSourceWebsite,
      investmentInvestorType,
      investmentInvolvement,
      investmentSpecificProgramme,
      investmentBusinessActivity,
      likelihoodToLand,
    ]) => ({
      adviser,
      advisers,
      sectors,
      investmentTypes: orderInvestmentTypes(investmentTypes),
      referralSourceActivity,
      referralSourceMarketing,
      referralSourceWebsite,
      investmentInvestorType,
      investmentInvolvement,
      investmentSpecificProgramme,
      investmentBusinessActivity,
      likelihoodToLand,
    })
  )
