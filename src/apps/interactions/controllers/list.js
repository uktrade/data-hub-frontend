const { get } = require('lodash')

const { interactionFiltersFieldConfig } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')
const { getOptions } = require('../../../lib/options')

async function renderInteractionList (req, res, next) {
  try {
    const token = req.session.token
    const currentAdviserId = get(req.session, 'user.id')
    const channels = await getOptions(token, 'communication-channel', { includeDisabled: true })
    const teams = await getOptions(token, 'team', { includeDisabled: true })

    const filtersFields = interactionFiltersFieldConfig({
      teams,
      channels,
      currentAdviserId,
    })
    const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

    res.render('collection', {
      filtersFields,
      selectedFilters,
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
