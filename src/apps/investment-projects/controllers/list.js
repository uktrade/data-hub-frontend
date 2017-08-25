const { omit, merge } = require('lodash')
const { buildSelectedFiltersSummary } = require('../../builders')
const { investmentFiltersFields: filtersFields, investmentSortForm } = require('../macros')

function renderInvestmentList (req, res) {
  const sortForm = merge({}, investmentSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('investment-projects/views/list', {
    title: 'Investment Projects',
    sortForm,
    filtersFields,
    selectedFilters,
  })
}

module.exports = {
  renderInvestmentList,
}
