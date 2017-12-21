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

    const filtersFields = interactionFiltersFieldConfig(adviserOptions, channelOptions)
    const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

    res.render('interactions/views/list', {
      title: 'Interactions',
      filtersFields,
      selectedFilters,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
