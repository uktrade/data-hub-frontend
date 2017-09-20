const { get, omit, merge } = require('lodash')
const { eventFiltersFields: filtersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderEventList (req, res) {
  const sortForm = merge({}, eventSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)
  const isUKSelected = get(selectedFilters, 'address_country.valueLabel') === 'United Kingdom'

  const visibleFiltersFields = filtersFields.filter(field => {
    if (field.name === 'uk_region') {
      return isUKSelected
    }
    return true
  })

  res.render('events/views/list', {
    title: 'Events',
    sortForm,
    filtersFields: visibleFiltersFields,
    selectedFilters,
  })
}

module.exports = {
  renderEventList,
}
