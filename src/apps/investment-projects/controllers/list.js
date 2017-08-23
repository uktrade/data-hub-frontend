const { omit, merge } = require('lodash')
const { buildSelectedInvestmentFiltersSummary } = require('../builders')
const { investmentFiltersFields: filtersFields, investmentSortForm } = require('../macros')

function renderInvestmentList (req, res) {
  const sortForm = merge({}, investmentSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedInvestmentFiltersSummary(req.query)

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
