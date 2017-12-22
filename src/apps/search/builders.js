const { isArray, assign } = require('lodash')

const { ENTITIES } = require('./constants')
const { filterNonPermittedItem } = require('../filters')

function buildSearchAggregation ({ aggregations, userPermissions, entityDetails = ENTITIES }) {
  if (!isArray(aggregations)) { return }

  const userEntities = entityDetails.filter(filterNonPermittedItem(userPermissions))

  return userEntities.map((defaultEntity) => {
    return assign(
      {},
      defaultEntity,
      aggregations.find((apiResponseEntity) => {
        return apiResponseEntity.entity === defaultEntity.entity
      })
    )
  })
}

module.exports = {
  buildSearchAggregation,
}
