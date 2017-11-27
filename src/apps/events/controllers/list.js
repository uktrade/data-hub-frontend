const { get, omit, merge, assign } = require('lodash')
const { eventFiltersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')
const { getAdvisers } = require('../../adviser/repos')

async function renderEventList (req, res, next) {
  try {
    const advisers = await getAdvisers(req.session.token)
    const filtersFields = eventFiltersFields({ advisers: advisers.results })
    const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)
    const isUKSelected = get(selectedFilters, 'address_country.valueLabel') === 'United Kingdom'

    const sortForm = merge({}, eventSortForm, {
      hiddenFields: assign({}, omit(req.query, 'sortby')),
      children: [
        { value: req.query.sortby },
      ],
    })

    const visibleFiltersFields = filtersFields.filter(field => {
      if (field.name === 'uk_region') {
        return isUKSelected
      }
      return true
    })

    res.render('events/views/list', {
      sortForm,
      title: 'Events',
      filtersFields: visibleFiltersFields,
      selectedFilters,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEventList,
}
