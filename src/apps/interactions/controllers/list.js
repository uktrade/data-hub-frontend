const { interactionFiltersFieldConfig } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

async function renderInteractionList (req, res, next) {
  try {
    const filtersFields = interactionFiltersFieldConfig(res.locals.advisers)
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
