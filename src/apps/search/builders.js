const { entities } = require('./services')

function buildSearchAggregation (apiResponseEntities) {
  return entities.map((defaultEntity) => {
    return Object.assign(
      {},
      defaultEntity,
      apiResponseEntities.find((apiResponseEntity) => {
        return apiResponseEntity.entity === defaultEntity.entity
      })
    )
  })
}

module.exports = {
  buildSearchAggregation,
}
