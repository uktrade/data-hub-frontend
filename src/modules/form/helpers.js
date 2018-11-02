const { isString, trimEnd, trimStart, map, join } = require('lodash')

const joinPaths = (paths) => {
  const cleanPaths = map(paths, (path, index) => {
    if (index === 0) {
      return trimEnd(path, '/')
    }

    if (index === paths.length - 1) {
      return trimStart(path, '/')
    }

    return trimStart(trimEnd(path, '/'), '/')
  })

  return join(cleanPaths, '/')
}

const getNextPath = (step, requestBody) => {
  if (step.nextPath) {
    return isString(step.nextPath) ? step.nextPath : step.nextPath(requestBody)
  }
}

module.exports = {
  getNextPath,
  joinPaths,
}
