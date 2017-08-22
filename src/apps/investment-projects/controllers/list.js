const { omit, merge } = require('lodash')
const { buildInvestmentFilters } = require('../builders')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

function renderInvestmentList (req, res) {
  const sortForm = merge({}, investmentSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const filtersFields = investmentFiltersFields.map(field => {
    field.modifier = ['smaller', 'light']
    field.value = req.query[field.name]
    return field
  })
  const filters = buildInvestmentFilters(req.query)

  res.render('investment-projects/views/list', {
    title: 'Investment Projects',
    sortForm,
    filtersFields,
    filters,
  })
}

module.exports = {
  renderInvestmentList,
}
