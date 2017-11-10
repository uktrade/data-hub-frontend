const { getAllAdvisers } = require('../../adviser/repos')
const { interactionFiltersFieldConfig } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

async function renderInteractionList (req, res, next) {
  try {
    const { results: advisers } = await getAllAdvisers(req.session.token)
    const filtersFields = interactionFiltersFieldConfig(advisers)
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
