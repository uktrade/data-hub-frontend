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

  res.render('collection', {
    sortForm,
    filtersFields,
    selectedFilters,
    title: 'Investment Projects',
    countLabel: 'project',
  })
}

module.exports = {
  renderInvestmentList,
}
