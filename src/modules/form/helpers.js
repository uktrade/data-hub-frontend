const { isString } = require('lodash')

const getNextPath = (step, requestBody) => {
  if (step.nextPath) {
    return isString(step.nextPath) ? step.nextPath : step.nextPath(requestBody)
  }
}

module.exports = {
  getNextPath,
}
