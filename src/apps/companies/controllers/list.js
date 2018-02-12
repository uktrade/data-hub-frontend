const { assign, get, omit, merge } = require('lodash')
const { companyFiltersFields, companySortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderCompanyList (req, res) {
  const query = req.query

  const sortForm = merge({}, companySortForm, {
    hiddenFields: assign({}, omit(query, 'sortby')),
    children: [
      { value: query.sortby },
    ],
  })

  const filtersFields = companyFiltersFields(res.locals.facets)
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, query)

  res.render('companies/views/list', {
    sortForm,
    selectedFilters,
    filtersFields,
    countLabel: 'company',
    highlightTerm: get(selectedFilters, 'name.valueLabel'),
    searchTerm: query.term,
  })
}

module.exports = {
  renderCompanyList,
}
