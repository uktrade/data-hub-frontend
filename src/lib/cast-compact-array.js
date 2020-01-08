const { castArray, compact } = require('lodash')

function castCompactArray(value) {
  return compact(castArray(value))
}

module.exports = castCompactArray
