const { mapValues, isObject } = require('lodash')

const host = process.env.QA_HOST

const deepMap = (value, host) => {
  return isObject(value)
    ? mapValues(value, (v) => deepMap(v, host))
    : `${host}/${value}`
}

const urls = {
  events: {
    collection: 'events',
  },
  investmentProjects: {
    collection: 'investment-projects',
  },
}

module.exports = deepMap(urls, host)
