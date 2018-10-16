const { isString, trimEnd, trimStart } = require('lodash')

const getFullRoute = (baseUrl, step) => {
  return `${trimEnd(baseUrl, '/')}/${trimStart(step.path, '/')}`
}

const getNextPath = (step, requestBody) => {
  if (step.nextPath) {
    return isString(step.nextPath) ? step.nextPath : step.nextPath(requestBody)
  }
}

module.exports = {
  getFullRoute,
  getNextPath,
}
