const { getAdvisers } = require('../../adviser/repos')
const { interactionFiltersFieldConfig } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')
const { transformObjectToOption } = require('../../transformers')
const { getOptions } = require('../../../lib/options')

async function renderInteractionList (req, res, next) {
  try {
    const token = req.session.token
    const { results: advisers } = await getAdvisers(token)
    const adviserOptions = advisers.map(transformObjectToOption)
    const channelOptions = await getOptions(token, 'communication-channel', { includeDisabled: true })
    const teamOptions = await getOptions(token, 'team', { includeDisabled: true })

    const filtersFields = interactionFiltersFieldConfig(adviserOptions, channelOptions, teamOptions)
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
