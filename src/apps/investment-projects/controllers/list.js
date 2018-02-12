const { assign, omit, merge } = require('lodash')
const { buildSelectedFiltersSummary } = require('../../builders')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

function renderInvestmentList (req, res) {
  const query = req.query

  const sortForm = merge({}, investmentSortForm, {
    hiddenFields: assign({}, omit(query, 'sortby')),
    children: [
      { value: query.sortby },
    ],
  })

  const filtersFields = investmentFiltersFields(res.locals.facets)
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, query)

  res.render('collection', {
    sortForm,
    selectedFilters,
    filtersFields,
    countLabel: 'project',
    searchTerm: query.term,
  })
}

module.exports = {
  renderInvestmentList,
}
