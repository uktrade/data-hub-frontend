import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import addressSearch from '../__fixtures__/address-search-SW1H 9AJ.json'

export function setupPostcodeMock200(apiEndpoint, adapterOptions = {}) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onGet(apiEndpoint).reply(200, addressSearch)

  return mock
}

export function setupPostcodeMock400(apiEndpoint, adapterOptions = {}) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onGet(apiEndpoint).reply(400)

  return mock
}

export function setupPostcodeMock404(apiEndpoint, adapterOptions = {}) {
  const mock = new MockAdapter(axios, adapterOptions)
  mock.onGet(apiEndpoint).reply(404)

  return mock
}
