const { omit, merge, assign } = require('lodash')
const { buildSelectedFiltersSummary } = require('../../builders')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

function renderInvestmentList (req, res) {
  const currentAdviserId = req.session.user.id

  const sortForm = merge({}, investmentSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const filtersFields = investmentFiltersFields({ currentAdviserId })
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
