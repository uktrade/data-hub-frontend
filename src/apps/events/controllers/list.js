const { get, omit, merge, assign } = require('lodash')
const { eventFiltersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderEventList (req, res) {
  const advisers = get(res.locals, 'advisers.results')
  const sortForm = merge({}, eventSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })
  const filtersFields = eventFiltersFields({ advisers })
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
