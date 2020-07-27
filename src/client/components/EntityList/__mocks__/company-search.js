import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import fixtures from '../__fixtures__'

export function setupSuccessMocks(
  apiEndpoint,
  adapterOptions = {},
  queryParams = {}
) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onPost(apiEndpoint, queryParams).reply(200, fixtures.companySearch)
  mock
    .onPost(apiEndpoint, { search_term: 'some other company', ...queryParams })
    .reply(200, fixtures.companySearchFilteredByCompanyName)
  mock
    .onPost(apiEndpoint, { postal_code: 'BN1 4SE', ...queryParams })
    .reply(200, fixtures.companySearchFilteredByPostcode)

  mock.onAny(apiEndpoint).reply(200, fixtures.companySearch)
  return mock
}

export function setupErrorMocks(apiEndpoint, adapterOptions = {}) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onPost(apiEndpoint).reply(500)
  return mock
}

export function setupNoResultsMocks(apiEndpoint, adapterOptions = {}) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onPost(apiEndpoint).reply(200, fixtures.companySearchNoResults)
  return mock
}
