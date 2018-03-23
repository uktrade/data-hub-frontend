const { get, omit, merge } = require('lodash')
const { companyFiltersFields: filtersFields, companySortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderCompanyList (req, res) {
  const sortForm = merge({}, companySortForm, {
    hiddenFields: omit(req.query, 'sortby'),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('_layouts/collection', {
    sortForm,
    filtersFields,
    selectedFilters,
    title: 'Companies',
    countLabel: 'company',
    highlightTerm: get(selectedFilters, 'name.valueLabel'),
    actionButtons: [{
      label: 'Add company',
      url: '/companies/add-step-1',
    }],
  })
}

module.exports = {
  renderCompanyList,
}
