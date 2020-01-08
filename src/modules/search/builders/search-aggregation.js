const { isArray, assign } = require('lodash')

const { filterNonPermittedItem } = require('../../permissions/filters')

function buildSearchAggregation({
  aggregations,
  userPermissions,
  entityDetails,
}) {
  if (!isArray(aggregations)) {
    return
  }

  const userEntities = entityDetails.filter(
    filterNonPermittedItem(userPermissions)
  )

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

module.exports = buildSearchAggregation
