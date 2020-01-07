const { trimEnd, trimStart, map, join, compact } = require('lodash')

const joinPaths = (paths) => {
  const cleanPaths = compact(
    map(paths, (path, index) => {
      if (index === 0) {
        return trimEnd(path, '/')
      }

      if (index === paths.length - 1) {
        return trimStart(path, '/')
      }

      return trimStart(trimEnd(path, '/'), '/')
    })
  )

  return join(cleanPaths, '/')
}

module.exports = {
  joinPaths,
}
