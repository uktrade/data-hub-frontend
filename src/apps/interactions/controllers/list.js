const { interactionFiltersFieldConfig } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderInteractionList (req, res, next) {
  const filtersFields = interactionFiltersFieldConfig(res.locals.advisers)
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('interactions/views/list', {
    title: 'Interactions',
    filtersFields,
    selectedFilters,
  })
}

module.exports = {
  renderInteractionList,
}
