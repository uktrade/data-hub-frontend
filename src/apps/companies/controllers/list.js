const { get, omit, merge } = require('lodash')
const { companyFiltersFields, companySortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderCompanyList (req, res) {
  const sortForm = merge({}, companySortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(companyFiltersFields, req.query)
  const isUKSelected = get(selectedFilters, 'country.valueLabel') === 'United Kingdom'

  const visibleFiltersFields = companyFiltersFields.filter(field => {
    if (field.name === 'uk_region') {
      return isUKSelected
    }
    return true
  })

  res.render('companies/views/list', {
    title: 'Companies',
    sortForm,
    filtersFields: visibleFiltersFields,
    selectedFilters,
  })
}

module.exports = {
  renderCompanyList,
}
