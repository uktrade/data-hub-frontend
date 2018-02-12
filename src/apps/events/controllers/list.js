const { get, omit, merge, assign } = require('lodash')
const { eventFiltersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderEventList (req, res, next) {
  const currentAdviserId = req.session.user.id
  const filtersFields = eventFiltersFields({ currentAdviserId, ...res.locals.facets })
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  const sortForm = merge({}, eventSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  res.render('events/views/list', {
    sortForm,
    selectedFilters,
    filtersFields,
    countLabel: 'event',
    highlightTerm: get(selectedFilters, 'name.valueLabel'),
  })
}

module.exports = {
  renderEventList,
}
