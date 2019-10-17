const { get } = require('lodash')

const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING = FILTER_CONSTANTS.PROPOSITIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.PROPOSITIONS.SECTOR.NAME

async function renderPropositionList (req, res, next) {
  try {
    const token = req.session.token
    const queryString = QUERY_STRING
    const currentAdviserId = get(req.session, 'user.id')
    const channels = await getOptions(token, 'communication-channel', { includeDisabled: true })
    const teams = await getOptions(token, 'team', { includeDisabled: true })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })

    const filtersFields = collectionFilterFields({
      teams,
      channels,
      currentAdviserId,
      sectorOptions,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    res.render('_layouts/collection', {
      selectedFilters,
      filtersFields: filtersFieldsWithSelectedOptions,
      title: 'Propositions',
      countLabel: 'proposition',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPropositionList,
}
