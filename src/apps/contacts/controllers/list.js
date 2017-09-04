const { get, omit, merge } = require('lodash')
const { contactFiltersFields: filtersFields, contactSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContactList (req, res) {
  const sortForm = merge({}, contactSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)
  const isUKSelected = get(selectedFilters, 'address_country.valueLabel') === 'United Kingdom'

  const visibleFiltersFields = filtersFields.filter(field => {
    if (field.name === 'company_uk_region') {
      return isUKSelected
    }
    return true
  })

  res.render('contacts/views/list', {
    title: 'Contacts',
    sortForm,
    filtersFields: visibleFiltersFields,
    selectedFilters,
  })
}

module.exports = {
  renderContactList,
}
