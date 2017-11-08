const { mapValues, isObject } = require('lodash')

const host = process.env.QA_HOST

const deepMap = (value, host) => {
  return isObject(value)
    ? mapValues(value, (v) => deepMap(v, host))
    : `${host}/${value}`
}

const urls = {
  companies: {
    collection: 'companies',
    search: 'search/companies',
  },
  contacts: {
    collection: 'contacts',
  },
  events: {
    collection: 'events',
  },
  interactions: {
    collection: 'interactions',
  },
  investmentProjects: {
    collection: 'investment-projects',
  },
}

module.exports = deepMap(urls, host)
