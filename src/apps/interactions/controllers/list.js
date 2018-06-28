const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INTERACTIONS.SECTOR.NAME

async function getInteractionOptions (token) {
  const sectorOptions = await getOptions(token, SECTOR, { queryString: QUERY_STRING })
  const serviceOptions = await getOptions(token, 'service', { includeDisabled: true })
  const teamOptions = await getOptions(token, 'team', { includeDisabled: true })

  return {
    sectorOptions,
    serviceOptions,
    teamOptions,
  }
}

async function renderInteractionList (req, res, next) {
  try {
    const { token, user } = req.session
    const { id: currentAdviserId, permissions } = user
    const { query } = req

    const options = await getInteractionOptions(token)

    const filtersFields = collectionFilterFields({
      currentAdviserId,
      permissions,
      ...options,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, query)

    res.render('_layouts/collection', {
      selectedFilters,
      filtersFields: filtersFieldsWithSelectedOptions,
      title: 'Interactions',
      countLabel: 'interaction',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
