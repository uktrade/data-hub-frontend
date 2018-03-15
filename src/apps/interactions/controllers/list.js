const { get } = require('lodash')

const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { getOptions } = require('../../../lib/options')

async function renderInteractionList (req, res, next) {
  try {
    const token = req.session.token
    const currentAdviserId = get(req.session, 'user.id')
    const channels = await getOptions(token, 'communication-channel', { includeDisabled: true })
    const teams = await getOptions(token, 'team', { includeDisabled: true })

    const filtersFields = collectionFilterFields({
      teams,
      channels,
      currentAdviserId,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    res.render('collection', {
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
